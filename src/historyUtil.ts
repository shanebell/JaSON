import { DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT } from "./types/HttpMethod";
import {
  APPLICATION_JSON,
  APPLICATION_XML,
  MULTIPART_FORM_DATA,
  TEXT_XML,
  X_WWW_FORM_URLENCODED,
} from "./types/ContentType";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import HistoryItem from "./types/HistoryItem";

const HTTP_METHODS = [GET.value, POST.value, PUT.value, PATCH.value, DELETE.value, HEAD.value, OPTIONS.value];
const CONTENT_TYPES = [
  APPLICATION_JSON.value,
  TEXT_XML.value,
  APPLICATION_XML.value,
  X_WWW_FORM_URLENCODED.value,
  MULTIPART_FORM_DATA.value,
];

/**
 * Convert a request from a legacy history item to a new history item.
 */
const legacyRequestToHistoryItem = (legacyHistoryItem: any): HistoryItem | null => {
  const { request, response } = legacyHistoryItem;
  try {
    if (!_.includes(HTTP_METHODS, request.method)) {
      return null;
    }

    if (!_.includes(CONTENT_TYPES, request.contentType)) {
      return null;
    }

    const date = new Date(request.time).getTime();
    if (!_.isFinite(date)) {
      return null;
    }

    const url = new URL(request.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return {
      id: uuidv4(),
      url: request.url,
      method: request.method,
      contentType: request.contentType,
      date: date,
      path: `${url.pathname}${url.search}${url.hash}`,
      host: url.host,
      body: request.body || "",
      headers: _.chain(request.headers)
        .map((header) => `${header.name || ""}: ${header.value || ""}`)
        .join("\n")
        .value(),
      status: response.status,
      searchableText: `${_.toLower(request.url)} ${_.toLower(request.method)} ${response.status || ""}`,
      favourite: 0,
    };
  } catch (e) {
    return null;
  }
};

export { legacyRequestToHistoryItem };
