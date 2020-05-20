import HttpRequest from "./HttpRequest";
import { toHistoryItem } from "./HistoryItem";

describe("toHistoryItem", () => {
  it("converts HttpRequest to HistoryItem", () => {
    const request: HttpRequest = {
      protocol: "https://",
      body: '{ "name": "value" }',
      contentType: "application/json",
      headers: "header1: value1\n header2:  value2 ",
      method: "GET",
      url: "www.example.com/path/to/resource?param1=value1&param2=value2#123",
    };

    const historyItem = toHistoryItem(request);
    expect(historyItem.body).toBe(request.body);
    expect(historyItem.contentType).toBe(request.contentType);
    expect(historyItem.headers).toBe(request.headers);
    expect(historyItem.method).toBe(request.method);
    expect(historyItem.url).toBe(request.url);
    expect(historyItem.host).toBe("www.example.com");
    expect(historyItem.path).toBe("/path/to/resource?param1=value1&param2=value2#123");
    expect(historyItem.date).toBeDefined();
    expect(historyItem.searchableText).toBe(
      "https://www.example.com/path/to/resource?param1=value1&param2=value2#123 get"
    );
    expect(historyItem.favourite).toBe(0);
  });
});
