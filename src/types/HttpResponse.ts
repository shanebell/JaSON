import { AxiosResponse } from "axios";

export default interface HttpResponse {
  startTime: number;
  endTime: number;
  status: number;
  contentType: string;
  headers: any;
  data?: any;
  responseText: string;
}

const toHttpResponse = (axiosResponse: AxiosResponse, startTime: number, endTime: number) => {
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

export { toHttpResponse };
