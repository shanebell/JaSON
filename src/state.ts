import { createHook, createStore, StoreActionApi } from "react-sweet-state";
import HttpRequest from "./types/HttpRequest";
import HttpResponse from "./types/HttpResponse";
import { sendRequest } from "./requestHandler";
import { decode } from "jsonwebtoken";
import axios, { CancelTokenSource } from "axios";
import historyService from "./historyService";
import HistoryItem, { toHistoryItem } from "./types/HistoryItem";
import { HistoryFilter } from "./types/HistoryFilter";
import _ from "lodash";

const LOCAL_STORAGE_THEME_KEY = "theme";
const JWT_PATTERN = /^\s*Authorization\s*:\s*Bearer\s+([a-zA-Z0-9-_.]+)\s*$/gm;

const defaultRequest: HttpRequest = {
  url: "",
  method: "GET",
  contentType: "application/json",
  body: "",
  headers: "",
};

const defaultResponse: HttpResponse = {
  startTime: 0,
  endTime: 0,
  status: 0,
  contentType: "",
  responseText: "",
  headers: {},
};

const defaultTheme: string = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || "dark";

interface State {
  request: HttpRequest;
  response: HttpResponse;
  loading: boolean;
  responseTab: number;
  theme: string;
  historyFilter: HistoryFilter;
  history: HistoryItem[];
  cancellable?: CancelTokenSource;
  jwt: string;
}

type StoreApi = StoreActionApi<State>;

// private actions (not exposed in state, used internally via dispatch)

const searchHistory = () => ({ setState, getState }: StoreApi) => {
  const historyFilter = getState().historyFilter;
  const start = Date.now();
  historyService.search(historyFilter, (results) => {
    const end = Date.now();
    console.debug("Search took %sms", end - start);
    setState({
      history: results,
    });
  });
};

const trimHistory = () => ({ dispatch }: StoreApi) => {
  historyService.trim(() => {
    dispatch(searchHistory());
  });
};

const parseHeaders = () => ({ setState, getState }: StoreApi) => {
  const { headers } = getState().request;
  let jwt;

  // parse all tokens and use the last one
  let matches;
  while ((matches = JWT_PATTERN.exec(headers))) {
    if (matches != null && _.size(matches) === 2) {
      try {
        const decoded = decode(matches[1], { complete: true, json: true });
        if (decoded) {
          jwt = JSON.stringify(decoded, null, 2);
        }
      } catch (e) {
        // ignore
      }
    }
  }
  setState({
    jwt,
  });
};

// public actions

const actions = {
  setRequestValue: (name: string, value: any) => ({ setState, getState, dispatch }: StoreApi) => {
    setState({
      request: {
        ...getState().request,
        [name]: value,
      },
    });
    if (name === "headers") {
      dispatch(parseHeaders());
    }
  },

  setResponseTab: (tab: number) => ({ setState }: StoreApi) => {
    setState({
      responseTab: tab,
    });
  },

  reset: () => ({ setState }: StoreApi) => {
    setState({
      request: defaultRequest,
      response: defaultResponse,
      responseTab: 0,
    });
  },

  send: () => async ({ setState, getState, dispatch }: StoreApi) => {
    setState({
      loading: true,
      response: defaultResponse,
    });

    const { request } = getState();

    const cancellable = axios.CancelToken.source();
    setState({ cancellable });
    const response = await sendRequest(request, cancellable.token);
    setState({ cancellable: undefined });

    if (response.status > 0) {
      const historyItem = toHistoryItem(request, response);

      historyService.save(historyItem, () => {
        dispatch(searchHistory());
        dispatch(trimHistory());
      });
    }

    setState({
      response,
      loading: false,
    });
  },

  cancel: () => ({ getState, setState }: StoreApi) => {
    const cancellable = getState().cancellable;
    if (cancellable) {
      cancellable.cancel();
      setState({
        cancellable: undefined,
      });
    }
  },

  toggleTheme: () => ({ setState, getState }: StoreApi) => {
    const theme = getState().theme === "dark" ? "light" : "dark";
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    setState({
      theme,
    });
  },

  clearHistory: (includeFavourites: boolean) => ({ dispatch }: StoreApi) => {
    historyService.clear(includeFavourites, () => {
      dispatch(searchHistory());
    });
  },

  selectHistoryItem: (historyItem: HistoryItem) => ({ setState }: StoreApi) => {
    const { url, method, contentType, body, headers } = historyItem;
    setState({
      request: {
        url,
        method,
        contentType,
        body,
        headers,
      },
      response: defaultResponse,
    });
  },

  favouriteHistoryItem: (historyItem: HistoryItem, favourite: boolean) => ({ dispatch }: StoreApi) => {
    historyService.update(historyItem, { favourite: favourite ? 1 : 0 }, () => {
      dispatch(searchHistory());
    });
  },

  removeHistoryItem: (historyItem: HistoryItem) => ({ dispatch }: StoreApi) => {
    historyService.delete(historyItem, () => {
      dispatch(searchHistory());
    });
  },

  setHistoryFilter: (name: string, value: any) => ({ setState, getState }: StoreApi) => {
    setState({
      historyFilter: {
        ...getState().historyFilter,
        [name]: value,
      },
    });
  },

  searchHistory: () => ({ dispatch }: StoreApi) => {
    dispatch(searchHistory());
  },

  migrateHistory: () => ({ dispatch }: StoreApi) => {
    historyService.migrate(() => {
      dispatch(searchHistory());
    });
  },
};

const store = createStore<State, typeof actions>({
  initialState: {
    request: defaultRequest,
    response: defaultResponse,
    theme: defaultTheme,
    loading: false,
    responseTab: 0,
    history: [],
    historyFilter: {
      searchTerm: "",
      showFavourites: false,
    },
    jwt: "",
  },
  actions,
});

const useTheme = createHook(store, {
  selector: (state: State) => {
    return state.theme;
  },
});

const useLoading = createHook(store, {
  selector: (state: State) => {
    return state.loading;
  },
});

const useRequest = createHook(store, {
  selector: (state: State) => {
    return state.request;
  },
});

const useJwt = createHook(store, {
  selector: (state: State) => {
    return state.jwt;
  },
});

const useResponse = createHook(store, {
  selector: (state: State) => {
    return {
      response: state.response,
      responseTab: state.responseTab,
    };
  },
});

const useHistory = createHook(store, {
  selector: (state: State) => {
    return state.history;
  },
});

const useHistoryFilter = createHook(store, {
  selector: (state: State) => {
    return state.historyFilter;
  },
});

export { useRequest, useResponse, useJwt, useHistory, useTheme, useLoading, useHistoryFilter };
