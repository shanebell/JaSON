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

const HTTP_PATTERN = /^http:\/*/i;
const HTTPS_PATTERN = /^https:\/*/i;
const FTP_PATTERN = /^ftp:\/*/i;

// sanitize request.url
const sanitizeUrl = (requestUrl: string): string => {
  requestUrl = _.trim(requestUrl);

  if (HTTPS_PATTERN.test(requestUrl)) {
    return requestUrl.replace(HTTPS_PATTERN, "https://");
  }

  if (HTTP_PATTERN.test(requestUrl)) {
    return requestUrl.replace(HTTP_PATTERN, "http://");
  }

  if (FTP_PATTERN.test(requestUrl)) {
    return requestUrl.replace(FTP_PATTERN, "http://");
  }

  return `http://${requestUrl}`;
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
