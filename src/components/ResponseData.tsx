import React, { useEffect, useState } from "react";
import HttpResponse from "../types/HttpResponse";
import * as prettier from "prettier/standalone";
import * as pluginBabel from "prettier/plugins/babel";
import * as pluginEstree from "prettier/plugins/estree";
import * as pluginXml from "@prettier/plugin-xml";
import WrappedAceEditor from "./WrappedAceEditor";
import { getConfig } from "../types/ContentType";

const ResponseData: React.FC<{ response: HttpResponse; formatted?: boolean }> = ({ response, formatted = true }) => {
  const config = getConfig(response);
  const [formattedText, setFormattedText] = useState<string>(response.responseText);

  useEffect(() => {
    if (!formatted || !config.parser) {
      setFormattedText(response.responseText);
      return;
    }

    const plugins = config.parser === "xml" ? [pluginXml as any] : [pluginBabel, pluginEstree];
    prettier
      .format(response.responseText, { parser: config.parser, plugins })
      .then((result) => setFormattedText(result))
      .catch(() => setFormattedText(response.responseText));
  }, [response, formatted, config.parser]);

  return (
    <WrappedAceEditor
      mode={formatted ? config.mode : "text"}
      value={formattedText}
      minLines={1}
      maxLines={5000}
      readOnly
      allowCopy={true}
      copyMessage="Response data copied to clipboard"
    />
  );
};

export default ResponseData;
