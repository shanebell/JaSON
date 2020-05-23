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

export { APPLICATION_JSON, TEXT_XML, APPLICATION_XML, X_WWW_FORM_URLENCODED, MULTIPART_FORM_DATA };
