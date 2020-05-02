import { createHook, createStore, StoreActionApi } from "react-sweet-state";
import _ from "lodash";
import HistoryItem from "./types/HistoryItem";

const LOCAL_STORAGE_HISTORY_KEY = "history";
const MAX_HISTORY_SIZE = 500;

const getLocalStorageHistory = (): HistoryItem[] => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY) || "[]");
};

const setLocalStorageHistory = (history: HistoryItem[]) => {
  localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
};

interface State {
  history: HistoryItem[];
}

type StoreApi = StoreActionApi<State>;

const actions = {
  clearHistory: () => ({ setState }: StoreApi) => {
    const history: HistoryItem[] = [];
    setLocalStorageHistory(history);
    setState({
      history,
    });
  },

  selectHistoryItem: (historyItem: HistoryItem) => ({ setState }: StoreApi) => {
    // setState({
    //   request: {
    //     url: historyItem.url,
    //     method: historyItem.method,
    //     contentType: historyItem.contentType,
    //     body: historyItem.body,
    //     headers: historyItem.headers,
    //   },
    //   historyOpen: false,
    // });
    console.log("selectHistoryItem");
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

const Store = createStore<State, typeof actions>({
  initialState: {
    history: getLocalStorageHistory(),
  },
  actions,
});

const useHistory = createHook(Store, { selector: null });

// export default useHistory;
