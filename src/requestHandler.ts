import _ from "lodash";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import HttpRequest from "./types/HttpRequest";
import HttpResponse from "./types/HttpResponse";

// prefix request.URL with "http://" if it's not already present
const addProtocolIfMissing = (request: HttpRequest) => {
  if (!_.isEmpty(request.url) && !/^http(s)?:\/\//.test(request.url)) {
    request.url = `http://${request.url}`;
  }
};

const sendAxiosRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    return await axios(config);
  } catch (error) {
    return error.response;
  }
};

export const sendRequest = async (request: HttpRequest): Promise<HttpResponse> => {
  addProtocolIfMissing(request);

  const config: AxiosRequestConfig = {
    url: request.url,
    method: request.method,
    headers: {
      "Content-Type": request.contentType,
    },
  };

  _.forEach(request.headers, (header) => {
    const name = _.trim(header.name);
    const value = _.trim(header.value);
    if (!_.isEmpty(name) && !_.isEmpty(value)) {
      config.headers[name] = value;
    }
  });

  if (!_.isEmpty(request.body)) {
    config.data = request.body;
  }

  const startTime = Date.now();
  const axiosResponse = await sendAxiosRequest(config);
  const endTime = Date.now();

  return {
    startTime,
    endTime,
    status: axiosResponse?.status || 999,
    contentType: axiosResponse?.headers["content-type"],
    headers: axiosResponse?.headers,
    data: axiosResponse?.data,
    responseText: axiosResponse?.request.responseText,
  };
};
