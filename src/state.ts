import { createHook, createStore, StoreActionApi } from "react-sweet-state";
import HttpRequest from "./types/HttpRequest";
import HttpResponse from "./types/HttpResponse";
import { sendRequest } from "./requestHandler";

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
  headers: {},
};

type ThemeType = "dark" | "light";

interface State {
  request: HttpRequest;
  response: HttpResponse;
  loading: boolean;
  activeTab: number;
  theme: ThemeType;
  colorScheme: number;
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

  setActiveTab: (activeTab: number) => ({ setState }: StoreApi) => {
    setState({
      activeTab,
    });
  },

  reset: () => ({ setState }: StoreApi) => {
    setState({
      request: defaultRequest,
      response: defaultResponse,
      activeTab: 0,
    });
  },

  send: () => async ({ setState, getState }: StoreApi) => {
    setState({
      loading: true,
      response: defaultResponse,
    });

    const response = await sendRequest(getState().request);

    setState({
      response,
      loading: false,
    });
  },

  setTheme: (theme: ThemeType) => ({ setState }: StoreApi) => {
    setState({
      theme,
    });
  },

  setColorScheme: (colorScheme: number) => ({ setState }: StoreApi) => {
    setState({
      colorScheme,
    });
  },
};

const Store = createStore<State, typeof actions>({
  initialState: {
    request: defaultRequest,
    response: defaultResponse,
    loading: false,
    activeTab: 0,
    theme: "dark",
    colorScheme: 1,

    // TODO
    // history
  },
  actions,
});

const useApplicationState = createHook(Store);

export default useApplicationState;
