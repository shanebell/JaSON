#  JaSON privacy policy

![JaSON logo](https://github.com/shanebell/JaSON/raw/master/public/jason-128x128.png)

JaSON is a Google Chrome extension for testing APIs and making HTTP network requests.

It is available to install from the Chrome Web Store:

https://chrome.google.com/webstore/detail/oealdlhfjifhgbmjnenhkgffglaibojf

JaSON does not collect or store your data remotely.

When a user successfully sends an HTTP/HTTPS request by clicking JaSON's "Send request" button the following request data is saved locally in the browser using [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).
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

The following request data is sent to the URL the user typed into the "URL" field when they made the request. *NOTE: this is the primary purpose of JaSON - ie: to send HTTP requests and view the response.*
- Request headers (including the selected "Content type")
- Request body
- Cookies - any cookies in the browser that match the URL typed into the "URL" field
- Standard HTTP headers sent by Chrome (eg: user-agent, accept, pragma etc)

This data is not sent to any 3rd parties or anywhere other than the URL entered by the user.