import _ from "lodash";
import React from "react";
import WrappedAceEditor from "./WrappedAceEditor";
import HttpHeader from "../types/HttpHeader";

const toString = (headers: HttpHeader[]): string => {
  const values = _.map(headers, (headerValue: any, headerName: string) => {
    return `${headerName}: ${headerValue}`;
  });
  return _.join(values, "\n");
};

const ResponseHeaders: React.FC<{ headers: HttpHeader[] }> = ({ headers }) => {
  return <WrappedAceEditor mode="yaml" value={toString(headers)} />;
};

export default ResponseHeaders;
