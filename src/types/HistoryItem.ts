import { Method } from "axios";
import { v4 as uuidv4 } from "uuid";
import HttpRequest from "./HttpRequest";

export default interface HistoryItem {
  id: string;
  protocol: string;
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
}

const toHistoryItem = (request: HttpRequest): HistoryItem => {
  const url = new URL(`${request.protocol}${request.url}`);
  const date = Date.now();
  return {
    id: uuidv4(),
    protocol: request.protocol,
    url: request.url,
    method: request.method,
    contentType: request.contentType,
    date: date,
    path: `${url.pathname}${url.search}${url.hash}`,
    host: url.host,
    body: request.body,
    headers: request.headers,
    searchableText: `${request.protocol}${request.url.toLowerCase()} ${request.method.toString().toLowerCase()}`,
    favourite: 0,
  };
};

export { toHistoryItem };
