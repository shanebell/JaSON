import _ from "lodash";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import RequestValues from "./types/RequestValues";
import RequestMetadata from "./types/RequestMetadata";

// prefix request.URL with "http://" if it's not already present
const addProtocolIfMissing = (request: RequestValues) => {
  if (!_.isEmpty(request.url) && !/^http(s)?:\/\//.test(request.url)) {
    request.url = `http://${request.url}`;
  }
};

const processResponse = (response: AxiosResponse, meta: RequestMetadata, onResponse: any) => {
  meta.endTime = Date.now();
  // TODO: show meta on the UI
  // response.meta = meta;
  console.log("response: %o", response);
  onResponse(response);
};

export const sendRequest = async (request: RequestValues, onResponse: any) => {
  addProtocolIfMissing(request);

  const options: AxiosRequestConfig = {
    url: request.url,
    method: request.method,
    headers: {
      "Content-Type": request.contentType,
    },
  };

  // TODO handle duplicate header names - currently the last one overrides any previous values
  _.forEach(request.headers, (header) => {
    const name = _.trim(header.name);
    const value = _.trim(header.value);
    if (!_.isEmpty(name) && !_.isEmpty(value)) {
      options.headers[name] = value;
    }
  });

  if (!_.isEmpty(request.body)) {
    options.data = request.body;
  }

  const meta: RequestMetadata = {
    startTime: Date.now(),
  };

  try {
    const response: AxiosResponse = await axios(options);
    processResponse(response, meta, onResponse);
  } catch (error) {
    processResponse(error.response, meta, onResponse);
  }
};
