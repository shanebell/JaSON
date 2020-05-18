import _ from "lodash";
import axios, { AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";
import flatten from "flat";
import HttpRequest, { processHeaders } from "./types/HttpRequest";
import HttpResponse, { toHttpResponse } from "./types/HttpResponse";

const sendAxiosRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    return await axios(config);
  } catch (error) {
    return error.response;
  }
};

const toFormData = (data: string): FormData => {
  const formData = new FormData();
  try {
    const json = JSON.parse(data);
    const flattened = flatten<{}, {}>(json);
    _.forEach(flattened, (value, key) => {
      formData.set(key, value);
    });
  } catch (e) {
    // ignore
  }
  return formData;
};

export const sendRequest = async (request: HttpRequest, cancelToken: CancelToken): Promise<HttpResponse> => {
  const config: AxiosRequestConfig = {
    url: `${request.protocol}${request.url}`,
    method: request.method,
    headers: {
      "Content-Type": request.contentType,
    },
    timeout: 60_000,
    cancelToken,
  };

  const headers = processHeaders(request.headers);
  _.forEach(headers, (header) => {
    config.headers[header.name] = header.value;
  });

  if (!_.isEmpty(request.body)) {
    if (request.contentType === "multipart/form-data") {
      config.data = toFormData(request.body);
    } else {
      config.data = request.body;
    }
  }

  const startTime = Date.now();
  const axiosResponse = await sendAxiosRequest(config);
  const endTime = Date.now();

  return toHttpResponse(axiosResponse, startTime, endTime);
};
