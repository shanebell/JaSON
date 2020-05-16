import Grid from "@material-ui/core/Grid";
import SendIcon from "@material-ui/icons/Send";
import RefreshIcon from "@material-ui/icons/Refresh";
import ClearIcon from "@material-ui/icons/Clear";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import React, { ChangeEvent, useEffect, useState } from "react";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useLoading, useRequest } from "../state";
import HttpMethod from "../types/HttpMethod";
import ContentType from "../types/ContentType";
import WrappedAceEditor from "./WrappedAceEditor";
import Typography from "@material-ui/core/Typography";

const HTTP_METHODS: HttpMethod[] = [
  {
    name: "GET",
    value: "GET",
    bodyAllowed: false,
  },
  {
    name: "POST",
    value: "POST",
    bodyAllowed: true,
  },
  {
    name: "PUT",
    value: "PUT",
    bodyAllowed: true,
  },
  {
    name: "PATCH",
    value: "PATCH",
    bodyAllowed: true,
  },
  {
    name: "DELETE",
    value: "DELETE",
    bodyAllowed: false,
  },
  {
    name: "HEAD",
    value: "HEAD",
    bodyAllowed: false,
  },
  {
    name: "OPTIONS",
    value: "OPTIONS",
    bodyAllowed: false,
  },
];

const CONTENT_TYPES: ContentType[] = [
  {
    name: "JSON (application/json)",
    value: "application/json",
  },
  {
    name: "XML (text/xml)",
    value: "text/xml",
  },
  {
    name: "XML (application/xml)",
    value: "application/xml",
  },
  {
    name: "Form data (multipart/form-data)",
    value: "multipart/form-data",
  },
];

const EDITOR_MODES: Record<string, string> = {
  "application/json": "json",
  "text/xml": "xml",
  "application/xml": "xml",
  "multipart/form-data": "json",
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
  },
  actions: {
    marginTop: theme.spacing(1),
  },
  button: {
    marginRight: theme.spacing(2),
  },
  tabs: {
    marginBottom: theme.spacing(2),
  },
  monospace: {
    fontFamily: "'Source Code Pro', monospace",
  },
  label: {
    marginBottom: theme.spacing(2),
  },
  tooltip: {
    maxWidth: 500,
  },
  tooltipCode: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: "bold",
    margin: 0,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  gridItem: {
    paddingTop: "0 !important",
  },
  textField: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  error: {
    fontSize: "14px",
  },
}));

const RequestFields: React.FC = () => {
  const classes = useStyles();
  const [requestBodyError, setRequestBodyError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<any>(null);
  const [showCancel, setShowCancel] = useState<boolean>(false);
  const [request, { setRequestValue, send, cancel, reset }] = useRequest();
  const [loading] = useLoading();

  const isRequestBodyAllowed = () => {
    return _.find(HTTP_METHODS, { value: request.method })?.bodyAllowed || false;
  };

  const handleFieldChange = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setRequestValue(name, event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (!loading && event.key === "Enter") {
      handleSend();
    }
  };

  const isValidRequestBody = () => {
    let valid = true;
    if (request.contentType === "multipart/form-data" && request.method === "POST") {
      try {
        JSON.parse(request.body);
      } catch (e) {
        valid = false;
        setRequestBodyError(`Unable to parse request body. ${e.message}`);
      }
    }
    return valid;
  };

  const handleSend = () => {
    setRequestBodyError(null);
    if (isValidRequestBody()) {
      const timeoutId = setTimeout(() => {
        setShowCancel(true);
      }, 2500);
      setTimeoutId(timeoutId);
      send();
    }
  };

  useEffect(() => {
    if (!loading && timeoutId) {
      clearTimeout(timeoutId);
      setShowCancel(false);
    }
  }, [loading, timeoutId]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={2} xl={1} className={classes.gridItem}>
        <TextField
          className={classes.textField}
          id="protocol"
          label="Protocol"
          margin="dense"
          select
          required
          fullWidth
          InputProps={{
            className: classes.monospace,
          }}
          value={request.protocol}
          onChange={handleFieldChange("protocol")}
        >
          {["http://", "https://"].map((protocol) => (
            <MenuItem key={protocol} value={protocol}>
              {protocol}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={10} xl={5} className={classes.gridItem}>
        <TextField
          className={classes.textField}
          id="url"
          label="Url"
          margin="dense"
          required
          fullWidth
          InputProps={{
            className: classes.monospace,
          }}
          inputProps={{
            maxLength: 1024,
          }}
          onKeyDown={handleKeyDown}
          value={request.url}
          autoFocus
          onChange={handleFieldChange("url")}
        />
      </Grid>

      <Grid item xs={6} xl={3} className={classes.gridItem}>
        <TextField
          className={classes.textField}
          id="method"
          label="Method"
          margin="dense"
          select
          required
          fullWidth
          InputProps={{
            className: classes.monospace,
          }}
          value={request.method}
          onChange={handleFieldChange("method")}
        >
          {HTTP_METHODS.map((method) => (
            <MenuItem key={method.value} value={method.value} dense>
              {method.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6} xl={3} className={classes.gridItem}>
        <TextField
          className={classes.textField}
          id="content-type"
          label="Content type"
          margin="dense"
          select
          required
          fullWidth
          InputProps={{
            className: classes.monospace,
          }}
          value={request.contentType}
          onChange={handleFieldChange("contentType")}
        >
          {CONTENT_TYPES.map((contentType) => (
            <MenuItem key={contentType.value} value={contentType.value} dense>
              {contentType.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} className={classes.gridItem}>
        <InputLabel className={classes.label}>Request headers</InputLabel>
        <Tooltip
          arrow
          classes={{ tooltip: classes.tooltip }}
          title={
            <>
              <Typography variant="caption">One header per line. Name and value separated by colon. eg:</Typography>
              <pre className={classes.tooltipCode}>Content-Type: application/json</pre>
            </>
          }
          enterDelay={500}
          enterNextDelay={500}
        >
          <Paper square variant="outlined">
            <WrappedAceEditor
              mode="properties"
              value={request.headers}
              minLines={3}
              maxLines={10}
              maxLength={1000}
              readOnly={false}
              onChange={(value: string) => {
                setRequestValue("headers", value);
              }}
            />
          </Paper>
        </Tooltip>
      </Grid>

      {isRequestBodyAllowed() && (
        <Grid item xs={12} className={classes.gridItem}>
          <InputLabel className={classes.label} error={requestBodyError != null}>
            Request body
          </InputLabel>
          <Paper square variant="outlined">
            <WrappedAceEditor
              mode={EDITOR_MODES[request.contentType]}
              value={request.body}
              minLines={10}
              maxLines={5000}
              maxLength={10_000}
              readOnly={false}
              onChange={(value: string) => {
                setRequestValue("body", value);
              }}
            />
          </Paper>
          {requestBodyError && (
            <FormHelperText error className={classes.error}>
              {requestBodyError}
            </FormHelperText>
          )}
        </Grid>
      )}

      <Grid item xs={12} className={`${classes.actions} ${classes.gridItem}`}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          disabled={loading}
          className={classes.button}
          onClick={handleSend}
          endIcon={<SendIcon />}
        >
          Send request
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="default"
          disabled={loading}
          className={classes.button}
          onClick={reset}
          endIcon={<RefreshIcon />}
        >
          Reset fields
        </Button>
        {showCancel && (
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            className={classes.button}
            onClick={cancel}
            endIcon={<ClearIcon />}
          >
            Cancel request
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default RequestFields;
