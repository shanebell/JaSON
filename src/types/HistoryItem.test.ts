import HttpRequest from "./HttpRequest";
import { toHistoryItem } from "./HistoryItem";
import HttpResponse from "./HttpResponse";

describe("toHistoryItem", () => {
  it("converts HttpRequest to HistoryItem", () => {
    const request: HttpRequest = {
      body: '{ "name": "value" }',
      contentType: "application/json",
      headers: "header1: value1\n header2:  value2 ",
      method: "GET",
      url: "https://Www.Example.Com/path/to/resource?param1=value1&param2=value2#123",
    };

    const response: HttpResponse = {
      contentType: "application/json",
      startTime: 1591772233578,
      endTime: 1591772233842,
      headers: [],
      data: { name: "value" },
      responseText: '{ "name": "value" }',
      status: 200,
    };

    const historyItem = toHistoryItem(request, response);
    expect(historyItem.body).toBe(request.body);
    expect(historyItem.contentType).toBe(request.contentType);
    expect(historyItem.headers).toBe(request.headers);
    expect(historyItem.method).toBe(request.method);
    expect(historyItem.url).toBe(request.url);
    expect(historyItem.host).toBe("www.example.com");
    expect(historyItem.path).toBe("/path/to/resource?param1=value1&param2=value2#123");
    expect(historyItem.date).toBeDefined();
    expect(historyItem.searchableText).toBe(
      "https://www.example.com/path/to/resource?param1=value1&param2=value2#123 get 200"
    );
    expect(historyItem.favourite).toBe(0);
    expect(historyItem.status).toBe(200);
  });
});
