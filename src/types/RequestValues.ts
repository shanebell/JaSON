import RequestHeader from "./RequestHeader";
import { Method } from "axios";

export default interface RequestValues {
  url: string;
  method: Method;
  contentType: string;
  body: string;
  headers: RequestHeader[];
}
