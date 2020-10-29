import { getConfig } from "./ContentType";
import HttpResponse from "./HttpResponse";

const response: HttpResponse = {
  contentType: "application/json",
  startTime: 1591772233578,
  endTime: 1591772233842,
  headers: [],
  data: { name: "value" },
  responseText: '{ "name": "value" }',
  status: 200,
};

describe("getConfig returns appropriate config based on content type of response", () => {
  test.each([
    ["application/json", "json", "json"],
    ["text/json", "json", "json"],
    ["application/vnd.schemaregistry.v1+json", "json", "json"],
    ["application/vnd.github.v3+json", "json", "json"],
    ["application/javascript", "javascript", "babel"],
    ["text/javascript", "javascript", "babel"],
    ["application/html", "html", undefined],
    ["text/html", "html", undefined],
  ])("%s => mode: %s, parser: %s", (contentType, mode, parser) => {
    response.contentType = contentType;
    const config = getConfig(response);
    expect(config.mode).toBe(mode);
    expect(config.parser).toBe(parser);
  });
});
