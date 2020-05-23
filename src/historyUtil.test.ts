import { legacyRequestToHistoryItem } from "./historyUtil";
import {
  APPLICATION_JSON,
  APPLICATION_XML,
  MULTIPART_FORM_DATA,
  TEXT_XML,
  X_WWW_FORM_URLENCODED,
} from "./types/ContentType";
import { DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT } from "./types/HttpMethod";

let request: any = null;

beforeEach(() => {
  request = {
    url: "https://httpbin.org/post",
    method: "POST",
    contentType: "application/json",
    headers: [
      { name: "Authorization", value: "Bearer 3ac4fafc-2665-4657-a2ca-c7451f6160ec" },
      { name: "content-type", value: "application/json" },
      { name: "name" },
      { value: "value" },
    ],
    body: '{ "name": "value" }',
    time: "2020-05-21T12:39:57.510Z",
  };
});

test("legacyRequestToHistoryItem converts a legacy history request to a history item", () => {
  const historyItem = legacyRequestToHistoryItem(request);
  expect(historyItem).toBeDefined();
  expect(historyItem?.url).toBe("https://httpbin.org/post");
  expect(historyItem?.method).toBe("POST");
  expect(historyItem?.contentType).toBe("application/json");
  expect(historyItem?.headers).toBe(
    "Authorization: Bearer 3ac4fafc-2665-4657-a2ca-c7451f6160ec\ncontent-type: application/json\nname: \n: value"
  );
  expect(historyItem?.body).toBe('{ "name": "value" }');
  expect(historyItem?.date).toBe(1590064797510);
  expect(historyItem?.searchableText).toBe("https://httpbin.org/post post");
});

describe("legacyRequestToHistoryItem only converts valid content types", () => {
  test.each([
    [APPLICATION_JSON.value, true],
    [APPLICATION_XML.value, true],
    [TEXT_XML.value, true],
    [X_WWW_FORM_URLENCODED.value, true],
    [MULTIPART_FORM_DATA.value, true],
    ["application/x-www-form-urlencoded;charset=utf-8", false],
    ["application/json;charset=utf-8", false],
    ["text/plain", false],
    ["text/json", false],
  ])("%s - %s", async (contentType, valid) => {
    request.contentType = contentType;
    const historyItem = legacyRequestToHistoryItem(request);
    if (valid) {
      expect(historyItem?.contentType).toBe(contentType);
    } else {
      expect(historyItem).toBeNull();
    }
  });
});

describe("legacyRequestToHistoryItem only converts valid URLs", () => {
  test.each([
    ["http://httpbin.org/ip", true],
    ["https://httpbin.org/ip", true],
    ["https://httpbin.org/ip?name=value", true],
    ["https://httpbin.org/ip?name=value#123", true],
    ["https://username:password@httpbin.org/ip?name=value#123", true],
    ["ftp://httpbin.org/ip", false],
    ["file:////etc/passwd", false],
    ["httpbin.org/ip", false],
    ["localhost:8080/", false],
  ])("%s - %s", async (url, valid) => {
    request.url = url;
    const historyItem = legacyRequestToHistoryItem(request);
    if (valid) {
      expect(historyItem?.url).toBe(url);
    } else {
      expect(historyItem).toBeNull();
    }
  });
});

describe("legacyRequestToHistoryItem only converts valid HTTP methods", () => {
  test.each([
    [GET.value, true],
    [POST.value, true],
    [PUT.value, true],
    [PATCH.value, true],
    [DELETE.value, true],
    [HEAD.value, true],
    [OPTIONS.value, true],
    ["TRACE", false],
    ["CONNECT", false],
  ])("%s - %s", async (method, valid) => {
    request.method = method;
    const historyItem = legacyRequestToHistoryItem(request);
    if (valid) {
      expect(historyItem?.method).toBe(method);
    } else {
      expect(historyItem).toBeNull();
    }
  });
});

describe("legacyRequestToHistoryItem only converts valid dates", () => {
  test.each([
    ["2020-05-21T12:39:57.510Z", true],
    ["1970-01-01T00:00:00.000Z", true],
    ["2020-05-21T12:39:57", true],
    ["2020-05-21", true],
    ["21-05-2020", false],
    ["21-05-2020T12:00:00", false],
    ["2020-05-21T12:39:57.x510Z", false],
  ])("%s - %s", async (time, valid) => {
    request.time = time;
    const historyItem = legacyRequestToHistoryItem(request);
    if (valid) {
      expect(historyItem?.date).toBeDefined();
    } else {
      expect(historyItem).toBeNull();
    }
  });
});
