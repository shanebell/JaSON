import { createHook, createStore, StoreActionApi } from "react-sweet-state";
import { v4 as uuidv4 } from "uuid";
import HttpRequest from "./types/HttpRequest";
import HttpResponse from "./types/HttpResponse";
import { sendRequest } from "./requestHandler";
import HttpHeader from "./types/HttpHeader";
import { Method } from "axios";
import moment from "moment";
import _ from "lodash";

const LOCAL_STORAGE_THEME_KEY = "theme";
const LOCAL_STORAGE_HISTORY_KEY = "history";
const MAX_HISTORY_SIZE = 500;

export interface HistoryItem {
  id: string;
  url: string;
  method: Method;
  contentType: string;
  path: string;
  host: string;
  date: string;
  body: string;
  headers: HttpHeader[];

  // TODO
  // favourite: boolean
}

const toHistoryItem = (request: HttpRequest): HistoryItem => {
  const url = new URL(request.url);
  return {
    id: uuidv4(),
    url: request.url,
    method: request.method,
    contentType: request.contentType,
    date: moment().format("DD/MM/YY HH:mm:ss"),
    path: url.pathname,
    host: url.host,
    body: request.body,
    headers: request.headers,
  };
};

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
  body:
    "{ \n" +
    '  "name1": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lacinia non purus a varius. Donec bibendum varius purus non volutpat. Nunc vel congue tortor, nec mollis arcu. Sed varius ante sed dictum pellentesque. Maecenas vel neque interdum, gravida elit et, aliquet dolor.",\n' +
    '  "name2": 10,\n' +
    '  "name3": false\n' +
    "}",
  headers: [],
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
  requestTab: number;
  responseTab: number;
  theme: string;
  historyOpen: boolean;
  history: HistoryItem[];
  aboutOpen: boolean;
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

  setRequestTab: (tab: number) => ({ setState }: StoreApi) => {
    setState({
      requestTab: tab,
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
      requestTab: 0,
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

    const historyItem = toHistoryItem(request);

    const history: HistoryItem[] = getLocalStorageHistory();
    history.unshift(historyItem);

    // if we"ve hit the history limit then splice any extras from the end
    if (history.length > MAX_HISTORY_SIZE) {
      history.splice(MAX_HISTORY_SIZE);
    }

    setLocalStorageHistory(history);

    setState({
      response,
      history,
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

  showHistory: () => ({ setState }: StoreApi) => {
    setState({
      historyOpen: true,
    });
  },

  hideHistory: () => ({ setState }: StoreApi) => {
    setState({
      historyOpen: false,
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
      historyOpen: false,
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

  showAbout: () => ({ setState }: StoreApi) => {
    setState({
      aboutOpen: true,
    });
  },

  hideAbout: () => ({ setState }: StoreApi) => {
    setState({
      aboutOpen: false,
    });
  },
};

const Store = createStore<State, typeof actions>({
  initialState: {
    request: defaultRequest,
    response: defaultResponse,
    theme: defaultTheme,
    loading: false,
    requestTab: 0,
    responseTab: 0,
    historyOpen: false,
    history: getLocalStorageHistory(),
    aboutOpen: false,
  },
  actions,
});

const useApplicationState = createHook(Store);

export default useApplicationState;
