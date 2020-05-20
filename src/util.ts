import _ from "lodash";

/**
 * Splits a full URL like "http://www.google.com" into protocol and url.
 * ie: { protocol: "http://", url: "www.google.com" }
 */
const splitUrl = (url: string): { url: string; protocol?: string } => {
  const HTTP_PATTERN = /^http:\/\//i;
  const HTTPS_PATTERN = /^https:\/\//i;

  url = _.trim(url);

  if (HTTPS_PATTERN.test(url)) {
    return {
      url: url.replace(HTTPS_PATTERN, ""),
      protocol: "https://",
    };
  }

  if (HTTP_PATTERN.test(url)) {
    return {
      url: url.replace(HTTP_PATTERN, ""),
      protocol: "http://",
    };
  }

  return {
    url: url,
  };
};

export { splitUrl };
