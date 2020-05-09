import { createHook, createStore, StoreActionApi } from "react-sweet-state";
import HttpRequest, { sanitizeUrl } from "./types/HttpRequest";
import HttpResponse from "./types/HttpResponse";
import { sendRequest } from "./requestHandler";
import axios, { CancelTokenSource } from "axios";
import historyService from "./historyService";
import HistoryItem, { toHistoryItem } from "./types/HistoryItem";

const LOCAL_STORAGE_THEME_KEY = "theme";
const MAX_HISTORY_SIZE = 500;

const defaultRequest: HttpRequest = {
  url: "https://httpbin.org/json",
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

export interface HistoryFilter {
  searchTerm: string;
  showFavourites: boolean;
}

interface State {
  request: HttpRequest;
  response: HttpResponse;
  loading: boolean;
  responseTab: number;
  theme: string;
  historyFilter: HistoryFilter;
  history: HistoryItem[];
  cancellable?: CancelTokenSource;
}

type StoreApi = StoreActionApi<State>;

// private actions, not exposed via actions

const searchHistory = () => ({ setState, getState }: StoreApi) => {
  const historyFilter = getState().historyFilter;
  const start = Date.now();
  historyService.search(historyFilter, (results) => {
    const end = Date.now();
    console.info("Search took %sms", end - start);
    setState({
      history: results,
    });
  });
};

const trimHistory = () => ({ dispatch }: StoreApi) => {
  historyService.trim(MAX_HISTORY_SIZE, () => {
    dispatch(searchHistory());
  });
};

const actions = {
  setRequestValue: (name: string, value: any) => ({ setState, getState }: StoreApi) => {
    setState({
      request: {
        ...getState().request,
        [name]: value,
      },
    });
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

    const request = getState().request;
    request.url = sanitizeUrl(request.url);
    setState({
      request,
    });

    const cancellable = axios.CancelToken.source();
    setState({ cancellable });
    const response = await sendRequest(request, cancellable.token);
    setState({ cancellable: undefined });

    if (response.status < 400) {
      const historyItem = toHistoryItem(request);

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

  cancel: () => async ({ getState, setState }: StoreApi) => {
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

  clearHistory: () => ({ setState, dispatch }: StoreApi) => {
    historyService.clear(() => {
      dispatch(searchHistory());
    });
  },

  selectHistoryItem: (historyItem: HistoryItem) => ({ setState }: StoreApi) => {
    setState({
      request: {
        url: historyItem.url,
        method: historyItem.method,
        contentType: historyItem.contentType,
        body: historyItem.body,
        headers: historyItem.headers,
      },
      response: defaultResponse,
    });
  },

  favouriteHistoryItem: (historyItem: HistoryItem, favourite: boolean) => ({ dispatch }: StoreApi) => {
    historyService.update(historyItem, { favourite: favourite ? 1 : 0 }, () => {
      dispatch(searchHistory());
    });
  },

  removeHistoryItem: (historyItem: HistoryItem) => ({ setState, dispatch }: StoreApi) => {
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

export { useRequest, useResponse, useHistory, useTheme, useLoading, useHistoryFilter };
