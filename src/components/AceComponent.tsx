import _ from "lodash";
import React from "react";
import HttpResponse from "../types/HttpResponse";
import useApplicationState from "../state";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserXml from "@prettier/plugin-xml/src/plugin";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-tomorrow";

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

const AceComponent: React.FC<{ response: HttpResponse; formatted?: boolean }> = ({ response, formatted = true }) => {
  const [state] = useApplicationState();
  const config = getConfig(response);

  return (
    <AceEditor
      mode={formatted ? config.mode : "text"}
      theme={state.theme === "dark" ? "tomorrow_night" : "tomorrow"}
      fontSize={16}
      name="formatted-response"
      width="100%"
      maxLines={10000}
      readOnly
      wrapEnabled
      value={formatted ? formatResponse(response, config.parser) : response.responseText}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        useWorker: false,
        showLineNumbers: false,
        showPrintMargin: false,
        highlightSelectedWord: false,
        // @ts-ignore
        foldStyle: "markbeginend",
        fontFamily: "'Source Code Pro', monospace",
      }}
    />
  );
};

export default AceComponent;
