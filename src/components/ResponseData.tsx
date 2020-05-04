import _ from "lodash";
import React from "react";
import HttpResponse from "../types/HttpResponse";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserXml from "@prettier/plugin-xml/src/plugin";
import WrappedAceEditor from "./WrappedAceEditor";

const CONTENT_TYPE_CONFIG: any = {
  "application/json": {
    mode: "json",
    parser: "json",
  },
  "text/json": {
    mode: "json",
    parser: "json",
  },
  "application/xml": {
    mode: "xml",
    parser: "xml",
  },
  "text/xml": {
    mode: "xml",
    parser: "xml",
  },
  "application/javascript": {
    mode: "javascript",
    parser: "babel",
  },
  "text/javascript": {
    mode: "javascript",
    parser: "babel",
  },
  "application/html": {
    mode: "html",
  },
  "text/html": {
    mode: "html",
  },
};

const getConfig = (response: HttpResponse) => {
  const config = _.find(CONTENT_TYPE_CONFIG, (value, key) => {
    return _.startsWith(response.contentType, key);
  });
  return config || { mode: "text" };
};

const formatResponse = (response: HttpResponse, parser: any): string => {
  const plugins = [parserBabel, parserXml];
  if (parser) {
    return prettier.format(response.responseText, { parser, plugins });
  } else {
    return response.responseText;
  }
};

const ResponseData: React.FC<{ response: HttpResponse; formatted?: boolean }> = ({ response, formatted = true }) => {
  const config = getConfig(response);

  return (
    <WrappedAceEditor
      mode={formatted ? config.mode : "text"}
      value={formatted ? formatResponse(response, config.parser) : response.responseText}
      minLines={1}
      maxLines={5000}
      readOnly
    />
  );
};

export default ResponseData;
