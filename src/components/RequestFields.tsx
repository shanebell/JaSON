import Grid from "@material-ui/core/Grid";
import SendIcon from "@material-ui/icons/Send";
import RefreshIcon from "@material-ui/icons/Refresh";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import React from "react";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useApplicationState } from "../state";
import HttpMethod from "../types/HttpMethod";
import ContentType from "../types/ContentType";
import WrappedAceEditor from "./WrappedAceEditor";

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
    name: "Form encoded",
    value: "application/x-www-form-urlencoded",
  },
];

const EDITOR_MODES: Record<string, string> = {
  "application/json": "json",
  "text/xml": "xml",
  "application/xml": "xml",
  "application/x-www-form-urlencoded": "json",
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
  },
  actions: {
    marginTop: theme.spacing(2),
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
}));

const RequestFields: React.FC = () => {
  const classes = useStyles();
  const [{ request, loading }, { updateRequestValues, send, reset }] = useApplicationState();

  const isRequestBodyAllowed = () => {
    return _.find(HTTP_METHODS, { value: request.method })?.bodyAllowed || false;
  };

  const handleFieldChange = (name: string) => (event: any) => {
    updateRequestValues(name, event.target.value);
  };

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      await send();
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} xl={6}>
        <TextField
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
      <Grid item xs={6} xl={3}>
        <TextField
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
      <Grid item xs={6} xl={3}>
        <TextField
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

      <Grid item xs={12}>
        <InputLabel className={classes.label}>Request headers</InputLabel>
        <Tooltip title="One header per line. eg: Content-Type: application/json">
          <Paper square variant="outlined">
            <WrappedAceEditor
              mode="properties"
              value={request.headers}
              minLines={5}
              maxLines={10}
              readOnly={false}
              onChange={(value: string) => {
                updateRequestValues("headers", value);
              }}
            />
          </Paper>
        </Tooltip>
      </Grid>

      {isRequestBodyAllowed() && (
        <Grid item xs={12}>
          <InputLabel className={classes.label}>Request body</InputLabel>
          <Paper square variant="outlined">
            <WrappedAceEditor
              mode={EDITOR_MODES[request.contentType]}
              value={request.body}
              minLines={10}
              maxLines={20}
              readOnly={false}
              onChange={(value: string) => {
                updateRequestValues("body", value);
              }}
            />
          </Paper>
        </Grid>
      )}

      <Grid item xs={12} className={classes.actions}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          disabled={loading}
          className={classes.button}
          onClick={send}
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
      </Grid>
    </Grid>
  );
};

export default RequestFields;
