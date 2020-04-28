import HttpHeader from "./HttpHeader";
import { Method } from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import HttpRequest from "./HttpRequest";

export default interface HistoryItem {
  id: string;
  url: string;
  method: Method;
  contentType: string;
  path: string;
  host: string;
  date: string;
  body: string;
  headers: HttpHeader[];

  // TODO
  // favourite: boolean
}

const toHistoryItem = (request: HttpRequest): HistoryItem => {
  const url = new URL(request.url);
  return {
    id: uuidv4(),
    url: request.url,
    method: request.method,
    contentType: request.contentType,
    date: moment().format("DD/MM/YY HH:mm:ss"),
    path: `${url.pathname}${url.search}${url.hash}`,
    host: url.host,
    body: request.body,
    headers: request.headers,
  };
};

export { toHistoryItem };
