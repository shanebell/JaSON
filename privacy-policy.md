#  JaSON privacy policy

![JaSON logo](https://github.com/shanebell/JaSON/raw/master/public/jason-128x128.png)

JaSON is a Google Chrome extension for testing APIs and making HTTP network requests.

It is available to install from the Chrome Web Store:

https://chrome.google.com/webstore/detail/oealdlhfjifhgbmjnenhkgffglaibojf

JaSON does not collect or store any data remotely.
Some limited data is stored locally using [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

## Request history

When a user successfully sends an HTTP request by clicking JaSON's "Send request" button the following request data is saved 
locally in the browser using IndexedDB. 

- ID - a randomly generated UUID 
- URL - the value the user typed into the "URL" field - eg: `http://example.com/path/to/resource`
- HTTP method - the value the user selected from the "Method" field - eg: `GET`, `POST` etc
- Content type - the value the user selected from the "Content type" field - eg: `JSON (application/json)`
- Request headers - the value the user typed into the "Request headers" field
- Request body - the value the user typed into the "Request body" field
- Path - the path extracted from the URL the user typed into the "URL" field - eg: `/path/to/resource`
- Host - the host extracted from the URL the user typed into the "URL" field - eg: `example.com`
- Date - the date/time the request was sent
- Status - the HTTP response code returned for the request - eg: `200`, `404` etc
- Searchable text - a concatenation of URL, HTTP method and response status
- Favourite - a flag indicating whether the user has marked the request as a favourite.

This data is not sent to any 3rd parties or stored anywhere other than within Chrome's IndexedDB storage.

Request history data is used within JaSON to provide the ability for users to select previously sent requests 
and re-send them. The data is stored in IndexedDB to allow for it to be easily searched and filtered.

## HTTP requests

The following request data is sent to the URL the user typed into the "URL" field when they made the request. 
This is the primary purpose of JaSON - ie: to send HTTP requests and view the response.

- Request headers - any HTTP headers the user typed into the "Request headers" field and the selected "Content type"
- Request body - the value the user typed into the "Request body" field
- Cookies - any cookies in the browser that match the URL typed into the "URL" field
- Standard HTTP headers sent by Chrome (eg: user-agent, accept, pragma etc)

This data is not sent to any 3rd parties or anywhere other than the URL type by the user in the "URL" field.