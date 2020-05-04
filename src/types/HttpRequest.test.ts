import { processHeaders, sanitizeUrl } from "./HttpRequest";
import HttpHeader from "./HttpHeader";

describe("sanitizeUrl cleans up URL and adds http:// if it's missing", () => {
  test.each([
    ["www.example.com", "http://www.example.com"],
    ["http:/localhost:8080", "http://localhost:8080/"],
    ["example.com", "http://example.com"],
    ["http:example.com", "http://example.com/"],
    ["http://www.example.com", "http://www.example.com/"],
    ["https://www.example.com", "https://www.example.com/"],
    ["ftp://www.example.com", "ftp://www.example.com/"],
  ])("%s -> %s", (url, expected) => {
    expect(sanitizeUrl(url)).toBe(expected);
  });
});

const validateHeader = (header: HttpHeader, name: string, value: string) => {
  expect(header.name).toBe(name);
  expect(header.value).toBe(value);
};

test("processHeaders converts request header string to header array", () => {
  const headers = processHeaders(
    "\nAuthorization : Bearer ba9619cc-9ffa-46d3-a506-22a443f7b591\n\n Content-Type:  text/html; charset=utf-8\t\n \tCache-Control:\tno-cache \r\nIf-Modified-Since:Wed, 21 Oct 2015 07:28:00 GMT \r\ninvalid\nname:\n:\n :\n\n\t:"
  );
  expect(headers.length).toBe(4);
  validateHeader(headers[0], "Authorization", "Bearer ba9619cc-9ffa-46d3-a506-22a443f7b591");
  validateHeader(headers[1], "Content-Type", "text/html; charset=utf-8");
  validateHeader(headers[2], "Cache-Control", "no-cache");
  validateHeader(headers[3], "If-Modified-Since", "Wed, 21 Oct 2015 07:28:00 GMT");
});
