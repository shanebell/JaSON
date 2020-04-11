import _ from "lodash";
import axios, { AxiosRequestConfig } from "axios";
import RequestValues from "./types/RequestValues";

// prefix request.URL with "http://" if it's not already present
const addProtocolIfMissing = (request: RequestValues) => {
  if (!_.isEmpty(request.url) && !/^http(s)?:\/\//.test(request.url)) {
    request.url = `http://${request.url}`;
  }
};

export const sendRequest = async (request: RequestValues) => {
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

  try {
    return axios(options);
  } catch (error) {
    return error.response;
  }
};
