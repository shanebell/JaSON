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

// prefix request.URL with "http://" if it's not already present
const addProtocolIfMissing = (request: HttpRequest) => {
  if (!_.isEmpty(request.url) && !/^http(s)?:\/\//.test(request.url)) {
    request.url = `http://${request.url}`;
  }
};

export { addProtocolIfMissing };
