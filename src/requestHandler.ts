import _ from "lodash";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import HttpRequest, { processHeaders, sanitizeUrl } from "./types/HttpRequest";
import HttpResponse, { toHttpResponse } from "./types/HttpResponse";

const sendAxiosRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    return await axios(config);
  } catch (error) {
    return error.response;
  }
};

export const sendRequest = async (request: HttpRequest): Promise<HttpResponse> => {
  const config: AxiosRequestConfig = {
    url: sanitizeUrl(request.url),
    method: request.method,
    headers: {
      "Content-Type": request.contentType,
    },
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
  console.log("Response: %s", JSON.stringify(axiosResponse, null, 2));
  const endTime = Date.now();

  return toHttpResponse(axiosResponse, startTime, endTime);
};
