import { createHook, createStore, StoreActionApi } from "react-sweet-state";
import HttpRequest from "./types/HttpRequest";
import HttpResponse from "./types/HttpResponse";
import { sendRequest } from "./requestHandler";
import _ from "lodash";
import database from "./database";
import HistoryItem, { toHistoryItem } from "./types/HistoryItem";

const LOCAL_STORAGE_THEME_KEY = "theme";
const LOCAL_STORAGE_HISTORY_KEY = "history";
const MAX_HISTORY_SIZE = 500;

const getLocalStorageHistory = (): HistoryItem[] => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY) || "[]");
};

const setLocalStorageHistory = (history: HistoryItem[]) => {
  localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
};

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
  history: HistoryItem[];
  historyTimestamp: number;
}

type StoreApi = StoreActionApi<State>;

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

  send: () => async ({ setState, getState }: StoreApi) => {
    setState({
      loading: true,
      response: defaultResponse,
    });

    const request = getState().request;
    const response = await sendRequest(request);

    if (response.status < 400) {
      const historyItem = toHistoryItem(request);

      console.log("Saving request to history db...");
      database.history.add(historyItem).then(() => {
        setState({
          historyTimestamp: Date.now(),
        });
      });

      const history: HistoryItem[] = getLocalStorageHistory();
      history.unshift(historyItem);

      // if we"ve hit the history limit then splice any extras from the end
      if (history.length > MAX_HISTORY_SIZE) {
        history.splice(MAX_HISTORY_SIZE);
      }

      setLocalStorageHistory(history);

      setState({
        history,
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

  clearHistory: () => ({ setState }: StoreApi) => {
    const history: HistoryItem[] = [];
    setLocalStorageHistory(history);
    setState({
      history,
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

  removeHistoryItem: (historyItem: HistoryItem) => ({ setState }: StoreApi) => {
    const history = getLocalStorageHistory();
    _.remove(history, { id: historyItem.id });
    setLocalStorageHistory(history);
    setState({
      history,
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
    history: getLocalStorageHistory(),
    historyTimestamp: Date.now(),
  },
  actions,
});

const useHistory = createHook(store, {
  selector: (state: State) => {
    return state.history;
  },
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

const useHistoryTimestamp = createHook(store, {
  selector: (state: State) => {
    return state.historyTimestamp;
  },
});

export { useRequest, useResponse, useHistory, useHistoryTimestamp, useTheme, useLoading };
