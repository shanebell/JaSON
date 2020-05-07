import { Method } from "axios";
import _ from "lodash";
import HttpHeader from "./HttpHeader";

export default interface HttpRequest {
  url: string;
  method: Method;
  contentType: string;
  body: string;
  headers: string;
}

const HTTP_PATTERN = /^http:\/*/;
const HTTPS_PATTERN = /^https:\/*/;
const FTP_PATTERN = /^ftp:\/*/;

// sanitize request.url
const sanitizeUrl = (requestUrl: string): string => {
  let sanitized = "";

  // handle some common typos
  if (HTTPS_PATTERN.test(requestUrl)) {
    sanitized = requestUrl.replace(HTTPS_PATTERN, "https://");
  } else if (HTTP_PATTERN.test(requestUrl)) {
    sanitized = requestUrl.replace(HTTP_PATTERN, "http://");
  } else if (FTP_PATTERN.test(requestUrl)) {
    sanitized = requestUrl.replace(FTP_PATTERN, "http://");
  } else {
    sanitized = `http://${requestUrl}`;
  }

  return sanitized;
};

// convert header string into an array of HttpHeader values
const processHeaders = (requestHeaders: string): HttpHeader[] => {
  const headers: HttpHeader[] = [];
  const lines: string[] = _.split(requestHeaders, /\n/);
  _.forEach(lines, (line) => {
    const colonIndex = _.indexOf(line, ":");
    if (colonIndex > 0) {
      const [name, value] = [line.substring(0, colonIndex).trim(), line.substring(colonIndex + 1).trim()];
      if (!_.isEmpty(name) && !_.isEmpty(value)) {
        headers.push({ name, value });
      }
    }
  });
  return headers;
};

export { sanitizeUrl, processHeaders };
