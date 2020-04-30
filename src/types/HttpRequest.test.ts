import HttpRequest, { addProtocolIfMissing } from "./HttpRequest";

let request: HttpRequest = {
  body: "{}",
  contentType: "application/json",
  headers: [],
  method: "GET",
  url: "www.example.com",
};

describe("addProtocolIfMissing adds http:// to the URL if it's missing", () => {
  test.each([
    ["www.example.com", "http://www.example.com"],
    ["example.com", "http://example.com"],
    ["http:example.com", "http://example.com/"],
    ["http://www.example.com", "http://www.example.com/"],
    ["https://www.example.com", "https://www.example.com/"],
    ["ftp://www.example.com", "ftp://www.example.com/"],
  ])("%s -> %s", (url, expected) => {
    request.url = url;
    addProtocolIfMissing(request);
    expect(request.url).toBe(expected);
  });
});
