import HttpResponse from "./HttpResponse";
import _ from "lodash";

export default interface ContentType {
  name: string;
  value: string;
}

const APPLICATION_JSON: ContentType = {
  name: "JSON (application/json)",
  value: "application/json",
};

const TEXT_XML: ContentType = {
  name: "XML (text/xml)",
  value: "text/xml",
};

const APPLICATION_XML: ContentType = {
  name: "XML (application/xml)",
  value: "application/xml",
};

const X_WWW_FORM_URLENCODED: ContentType = {
  name: "Form data (application/x-www-form-urlencoded)",
  value: "application/x-www-form-urlencoded",
};

const MULTIPART_FORM_DATA: ContentType = {
  name: "Form data (multipart/form-data)",
  value: "multipart/form-data",
};

const contentTypes: ContentType[] = [
  APPLICATION_JSON,
  TEXT_XML,
  APPLICATION_XML,
  X_WWW_FORM_URLENCODED,
  MULTIPART_FORM_DATA,
];

export interface ContentTypeConfig {
  mode: string;
  parser?: string;
}

const CONTENT_TYPE_CONFIG: { pattern: RegExp; config: ContentTypeConfig }[] = [
  {
    pattern: /^(application|text)\/.*json/,
    config: {
      mode: "json",
      parser: "json",
    },
  },
  {
    pattern: /^(application|text)\/.*xml/,
    config: {
      mode: "xml",
      parser: "xml",
    },
  },
  {
    pattern: /(application|text)\/.*javascript/,
    config: {
      mode: "javascript",
      parser: "babel",
    },
  },
  {
    pattern: /(application|text)\/.*html/,
    config: {
      mode: "html",
    },
  },
];

// Check if the size of the given response is of a suitable length to format
const isLengthOk = (response: HttpResponse) => {
  return response.responseText?.length < 50_000;
};

const getConfig = (response: HttpResponse): ContentTypeConfig => {
  let contentType;
  if (isLengthOk(response)) {
    contentType = _.find(CONTENT_TYPE_CONFIG, (value) => {
      return value.pattern.test(response.contentType);
    });
  }
  return contentType?.config || { mode: "text" };
};

export {
  contentTypes,
  getConfig,
  APPLICATION_JSON,
  TEXT_XML,
  APPLICATION_XML,
  X_WWW_FORM_URLENCODED,
  MULTIPART_FORM_DATA,
};
