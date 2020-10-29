import React from "react";
import HttpResponse from "../types/HttpResponse";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserXml from "@prettier/plugin-xml/src/plugin";
import WrappedAceEditor from "./WrappedAceEditor";
import { getConfig } from "../types/ContentType";

const formatResponse = (response: HttpResponse, parser?: any): string => {
  if (parser) {
    try {
      const plugins = [parserBabel, parserXml];
      return prettier.format(response.responseText, { parser, plugins });
    } catch (e) {
      // ignore
    }
  }
  return response.responseText;
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
