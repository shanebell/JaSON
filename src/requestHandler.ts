import _ from "lodash";
import axios, { AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";
import flatten from "flat";
import qs from "qs";
import HttpRequest, { processHeaders } from "./types/HttpRequest";
import HttpResponse, { toHttpResponse } from "./types/HttpResponse";
import { MULTIPART_FORM_DATA, X_WWW_FORM_URLENCODED } from "./types/ContentType";

const sendAxiosRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    return await axios(config);
  } catch (error) {
    return error.response;
  }
};

const toMultipartFormData = (data: string): FormData => {
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

const toFormUrlEncoded = (data: string): string => {
  try {
    const json = JSON.parse(data);
    return qs.stringify(json);
  } catch (e) {
    // ignore
  }
  return "";
};

const getRequestBody = (request: HttpRequest) => {
  if (request.contentType === X_WWW_FORM_URLENCODED.value) {
    return toFormUrlEncoded(request.body);
  }

  if (request.contentType === MULTIPART_FORM_DATA.value) {
    return toMultipartFormData(request.body);
  }

  return request.body;
};

export const sendRequest = async (request: HttpRequest, cancelToken: CancelToken): Promise<HttpResponse> => {
  const config: AxiosRequestConfig = {
    url: request.url,
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
    config.data = getRequestBody(request);
  }

  const startTime = Date.now();
  const axiosResponse = await sendAxiosRequest(config);
  const endTime = Date.now();

  return toHttpResponse(axiosResponse, startTime, endTime);
};
