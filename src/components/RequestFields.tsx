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
import HttpMethod, { GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS } from "../types/HttpMethod";
import ContentType, { MULTIPART_FORM_DATA, TEXT_XML, APPLICATION_XML, APPLICATION_JSON } from "../types/ContentType";
import WrappedAceEditor from "./WrappedAceEditor";
import Typography from "@material-ui/core/Typography";

const HTTP_METHODS: HttpMethod[] = [GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS];

const CONTENT_TYPES: ContentType[] = [APPLICATION_JSON, TEXT_XML, APPLICATION_XML, MULTIPART_FORM_DATA];

const EDITOR_MODES: Record<string, string> = {
  [APPLICATION_JSON.value]: "json",
  [TEXT_XML.value]: "xml",
  [APPLICATION_XML.value]: "xml",
  [MULTIPART_FORM_DATA.value]: "json",
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
  const [urlError, setUrlError] = useState<string | null>(null);
  const [bodyError, setBodyError] = useState<string | null>(null);
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

  const validateUrl = () => {
    const valid = request.url.trim().length > 0;
    setUrlError(valid ? null : "Url is required");
    return valid;
  };

  const validateBody = () => {
    let error = null;
    if (request.contentType === MULTIPART_FORM_DATA.value && request.method === POST.value) {
      try {
        JSON.parse(request.body);
      } catch (e) {
        error = `Unable to parse request body. ${e.message}`;
      }
    }
    setBodyError(error ? error : null);
    return error == null;
  };

  const validate = (): boolean => {
    const validUrl = validateUrl();
    const validBody = validateBody();
    return validUrl && validBody;
  };

  const handleSend = () => {
    if (validate()) {
      const timeoutId = setTimeout(() => {
        setShowCancel(true);
      }, 2500);
      setTimeoutId(timeoutId);
      send();
    }
  };

  const handleReset = () => {
    setBodyError(null);
    setUrlError(null);
    reset();
  };

  useEffect(() => {
    if (!loading && timeoutId) {
      clearTimeout(timeoutId);
      setShowCancel(false);
    }
  }, [loading, timeoutId]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} xl={5} className={classes.gridItem}>
        <TextField
          className={classes.textField}
          id="url"
          label="Url"
          margin="dense"
          required
          error={urlError != null}
          helperText={urlError}
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
          <InputLabel className={classes.label} error={bodyError != null}>
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
          {bodyError && (
            <FormHelperText error className={classes.error}>
              {bodyError}
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
          onClick={handleReset}
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
