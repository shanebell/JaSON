import { createHook, createStore } from "react-sweet-state";
import RequestValues from "./types/RequestValues";
import { AxiosResponse } from "axios";
import { sendRequest } from "./requestHandler";
import RequestMetadata from "./types/RequestMetadata";

const defaultRequestValues: RequestValues = {
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

const defaultResponse: AxiosResponse = {
  data: "",
  status: 0,
  statusText: "",
  headers: [],
  config: {},
  request: null,
};

const defaultMeta: RequestMetadata = {
  startTime: 0,
  endTime: 0,
};

const Store = createStore({
  initialState: {
    requestValues: defaultRequestValues,
    response: defaultResponse,
    meta: defaultMeta,
    loading: false,
    activeTab: 0,

    // TODO
    // history
  },

  actions: {
    updateRequestValues: (name: string, value: any) => ({ setState, getState }) => {
      setState({
        requestValues: {
          ...getState().requestValues,
          [name]: value,
        },
      });
    },

    setActiveTab: (activeTab: number) => ({ setState }) => {
      setState({
        activeTab,
      });
    },

    reset: () => ({ setState }) => {
      setState({
        requestValues: defaultRequestValues,
        response: defaultResponse,
        meta: defaultMeta,
        activeTab: 0,
      });
    },

    send: () => async ({ setState, getState }) => {
      setState({
        loading: true,
        response: defaultResponse,
        meta: defaultMeta,
      });

      const startTime = Date.now();
      const response = await sendRequest(getState().requestValues);
      const endTime = Date.now();

      setState({
        response,
        meta: {
          startTime,
          endTime,
        },
        loading: false,
      });
    },
  },
});

const useApplicationState = createHook(Store);

export default useApplicationState;
