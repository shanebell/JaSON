import HttpHeader from "./HttpHeader";
import { Method } from "axios";
import _ from "lodash";

export default interface HttpRequest {
  url: string;
  method: Method;
  contentType: string;
  body: string;
  headers: HttpHeader[];
}

// prefix request.url with "http://" if it's not already there
const addProtocolIfMissing = (request: HttpRequest) => {
  if (!_.isEmpty(request.url)) {
    try {
      // this handles common typos like - "http:www.example.com"
      const url = new URL(request.url);
      request.url = url.href;
    } catch (e) {
      // URL is invalid so assume HTTP
      if (!/^http(s)?:\/\//.test(request.url)) {
        request.url = `http://${request.url}`;
      }
    }
  }
};

export { addProtocolIfMissing };
