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

// sanitize request.url and add "http://" prefix if it's not already there
const sanitizeUrl = (requestUrl: string): string => {
  if (!_.isEmpty(requestUrl)) {
    try {
      // this handles common typos like - "http:www.example.com"
      const url = new URL(requestUrl);
      return url.href;
    } catch (e) {
      // URL is invalid so assume HTTP
      if (!/^http(s)?:\/\//.test(requestUrl)) {
        return `http://${requestUrl}`;
      }
    }
  }

  // fallback to the original url
  return requestUrl;
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
