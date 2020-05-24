import _ from "lodash";

const historyItem = {
  request: {
    url: "https://httpbin.org/ip",
    method: "GET",
    contentType: "application/json",
    headers: [
      { name: "Authorization", value: "Bearer 3ac4fafc-2665-4657-a2ca-c7451f6160ec" },
      { name: "content-type", value: "application/json" },
    ],
    body: "",
    time: "2020-05-21T12:39:57.510Z",
  },
  response: {
    data: '{\n  "origin": "1.157.185.79"\n}',
    status: 200,
    headers: [
      {
        name: "access-control-allow-credentials",
        value: "true",
      },
      { name: "access-control-allow-origin", value: "*" },
      {
        name: "content-length",
        value: "31",
      },
      { name: "content-type", value: "application/json" },
      {
        name: "date",
        value: "Thu, 21 May 2020 12:39:57 GMT",
      },
      { name: "server", value: "gunicorn/19.9.0" },
      { name: "status", value: "200" },
    ],
    config: {
      method: "GET",
      transformRequest: [null],
      transformResponse: [null],
      url: "https://httpbin.org/ip",
      headers: {
        "Content-Type": "application/json",
        test: "value",
        Accept: "application/json, text/plain, */*",
      },
      data: "",
    },
    statusText: "",
    time: "2020-05-21T12:39:57.732Z",
  },
};

const domains = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "mauris",
  "gravida",
  "arcu",
  "nibh",
  "sed",
  "scelerisque",
  "metus",
  "varius",
  "eget",
  "ut",
  "et",
  "facilisis",
  "eros",
  "in",
  "posuere",
  "lectus",
  "sed",
  "non",
  "lorem",
  "augue",
  "nullam",
  "in",
  "maximus",
  "erat",
  "donec",
  "sagittis",
  "quis",
  "nunc",
  "aliquam",
  "aliquam",
  "pellentesque",
  "suscipit",
  "maximus",
  "quam",
  "eu",
  "euismod",
  "ex",
  "luctus",
  "nec",
  "integer",
  "consectetur",
  "commodo",
  "ex",
  "at",
  "condimentum",
];

const methods = ["GET", "POST", "PATCH", "PUT", "DELETE"];

const testHistory = _.times(2000, (i) => {
  return {
    ...historyItem,
    request: {
      ...historyItem.request,
      url: `https://www.${domains[i % domains.length]}.com/${i}`,
      method: `${methods[i % methods.length]}`,
    },
  };
});

export default testHistory;
