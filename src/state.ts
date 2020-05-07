import { createHook, createStore, StoreActionApi } from "react-sweet-state";
import HttpRequest, { sanitizeUrl } from "./types/HttpRequest";
import HttpResponse from "./types/HttpResponse";
import { sendRequest } from "./requestHandler";
import historyService from "./historyService";
import HistoryItem, { toHistoryItem } from "./types/HistoryItem";

const LOCAL_STORAGE_THEME_KEY = "theme";
const MAX_HISTORY_SIZE = 500;

const defaultRequest: HttpRequest = {
  url: "https://httpbin.org/post",
  method: "POST",
  contentType: "application/json",
  body: '{\n    "name1": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."\n}',
  headers: "Authorization: Bearer 11111111-1111-1111-1111-111111111111",
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
  searchTerm: string;
  history: HistoryItem[];
}

type StoreApi = StoreActionApi<State>;

const searchHistory = () => ({ setState, getState }: StoreApi) => {
  const searchTerm = getState().searchTerm;
  historyService.search(searchTerm, 100, (results) => {
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
  updateRequestValues: (name: string, value: any) => ({ setState, getState }: StoreApi) => {
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

    const response = await sendRequest(request);

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

  removeHistoryItem: (historyItem: HistoryItem) => ({ setState, dispatch }: StoreApi) => {
    historyService.delete(historyItem, () => {
      dispatch(searchHistory());
    });
  },

  setSearchTerm: (searchTerm: string) => ({ setState }: StoreApi) => {
    setState({
      searchTerm,
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
    searchTerm: "",
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

const useSearchTerm = createHook(store, {
  selector: (state: State) => {
    return state.searchTerm;
  },
});

export { useRequest, useResponse, useHistory, useSearchTerm, useTheme, useLoading };
