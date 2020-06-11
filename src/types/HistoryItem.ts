import { Method } from "axios";
import { v4 as uuidv4 } from "uuid";
import HttpRequest from "./HttpRequest";
import HttpResponse from "./HttpResponse";
import _ from "lodash";

export default interface HistoryItem {
  id: string;
  url: string;
  method: Method;
  contentType: string;
  path: string;
  host: string;
  date: number;
  body: string;
  headers: string;
  searchableText: string;
  favourite: number; // https://github.com/dfahlander/Dexie.js/issues/70
  status?: number;
}

const toHistoryItem = (request: HttpRequest, response: HttpResponse): HistoryItem => {
  const url = new URL(request.url);
  const date = Date.now();
  return {
    id: uuidv4(),
    url: request.url,
    method: request.method,
    contentType: request.contentType,
    date: date,
    path: `${url.pathname}${url.search}${url.hash}`,
    host: url.host,
    body: request.body,
    headers: request.headers,
    searchableText: `${_.toLower(request.url)} ${_.toLower(request.method)} ${response.status}`,
    favourite: 0,
    status: response.status,
  };
};

export { toHistoryItem };
