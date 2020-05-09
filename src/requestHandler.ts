import _ from "lodash";
import axios, { AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";
import HttpRequest, { processHeaders } from "./types/HttpRequest";
import HttpResponse, { toHttpResponse } from "./types/HttpResponse";

const sendAxiosRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    return await axios(config);
  } catch (error) {
    return error.response;
  }
};

export const sendRequest = async (request: HttpRequest, cancelToken: CancelToken): Promise<HttpResponse> => {
  const config: AxiosRequestConfig = {
    url: request.url,
    method: request.method,
    headers: {
      "Content-Type": request.contentType,
    },
    cancelToken,
  };

  const headers = processHeaders(request.headers);
  _.forEach(headers, (header) => {
    config.headers[header.name] = header.value;
  });

  if (!_.isEmpty(request.body)) {
    config.data = request.body;
  }

  const startTime = Date.now();
  const axiosResponse = await sendAxiosRequest(config);
  const endTime = Date.now();

  return toHttpResponse(axiosResponse, startTime, endTime);
};
