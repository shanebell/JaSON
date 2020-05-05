import _ from "lodash";
import React from "react";
import WrappedAceEditor from "./WrappedAceEditor";

const toString = (headers: any): string => {
  const values = _.map(headers, (headerValue: any, headerName: string) => {
    return `${headerName}: ${headerValue}`;
  });
  return _.join(values, "\n");
};

const ResponseHeaders: React.FC<{ headers: any }> = ({ headers }) => {
  return <WrappedAceEditor mode="yaml" value={toString(headers)} readOnly minLines={1} maxLines={100} />;
};

export default ResponseHeaders;
