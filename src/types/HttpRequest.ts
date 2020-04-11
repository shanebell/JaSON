import HttpHeader from "./HttpHeader";
import { Method } from "axios";

export default interface HttpRequest {
  url: string;
  method: Method;
  contentType: string;
  body: string;
  headers: HttpHeader[];
}
