import { splitUrl } from "./util";

describe("splitUrl splits URL into protocol and url", () => {
  test.each([
    // no protocol - should be prefixed with "http://"
    [" www.example.com", "www.example.com", undefined],
    ["localhost:8080", "localhost:8080", undefined],
    ["\thttpbin.org ", "httpbin.org", undefined],
    ["username:password@httpbin.org\t", "username:password@httpbin.org", undefined],

    // http variants
    ["http://localhost:8080", "localhost:8080", "http://"],
    ["http://httpbin.org", "httpbin.org", "http://"],
    ["http://username:password@httpbin.org", "username:password@httpbin.org", "http://"],

    // https variants
    ["https://example.com", "example.com", "https://"],
    [" https://username:password@example.com", "username:password@example.com", "https://"],
    ["HTTPS://username:password@example.com", "username:password@example.com", "https://"],
    ["HttpS://example.com", "example.com", "https://"],
  ])("%s", (requestUrl, expectedUrl, expectedProtocol) => {
    const { url, protocol } = splitUrl(requestUrl);
    expect(url).toBe(expectedUrl);
    expect(protocol).toBe(expectedProtocol);
  });
});
