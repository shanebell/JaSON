import Chip from "@material-ui/core/Chip";
import React from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  success: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
  },
  error: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}));

const statusCodes: Record<number, string> = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",

  // success
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  306: "(Unused)",
  307: "Temporary Redirect",
  308: "Permanent Redirect",

  // error
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Unassigned",
  426: "Upgrade Required",
  427: "Unassigned",
  428: "Precondition Required",
  429: "Too Many Requests",
  430: "Unassigned",
  431: "Request Header Fields Too Large",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  509: "Unassigned",
  510: "Not Extended",
  511: "Network Authentication Required",
};

const isError = (statusCode: number) => _.toNumber(statusCode) >= 400;

const StatusCode: React.FC<{ status: number }> = ({ status }) => {
  const classes = useStyles();

  if (status) {
    const statusText = statusCodes[status];
    const label = statusText ? `${status} - ${statusText}` : status;
    const classNames = `${classes.root} ${isError(status) ? classes.error : classes.success}`;

    return <Chip className={classNames} label={label} size="small" variant="outlined" color="primary" />;
  } else {
    return null;
  }
};

export default StatusCode;
