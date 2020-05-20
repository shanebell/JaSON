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

export { processHeaders };
