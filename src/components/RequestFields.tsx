import Grid from "@material-ui/core/Grid";
import SendIcon from "@material-ui/icons/Send";
import RefreshIcon from "@material-ui/icons/Refresh";
import ClearIcon from "@material-ui/icons/Clear";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useJwt, useLoading, useRequest } from "../state";
import { httpMethods, isRequestBodyAllowed } from "../types/HttpMethod";
import {
  APPLICATION_JSON,
  APPLICATION_XML,
  contentTypes,
  MULTIPART_FORM_DATA,
  TEXT_XML,
  X_WWW_FORM_URLENCODED,
} from "../types/ContentType";
import WrappedAceEditor from "./WrappedAceEditor";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { Popover } from "@material-ui/core";

const EDITOR_MODES: Record<string, string> = {
  [APPLICATION_JSON.value]: "json",
  [TEXT_XML.value]: "xml",
  [APPLICATION_XML.value]: "xml",
  [X_WWW_FORM_URLENCODED.value]: "json",
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
  headers: {
    position: "relative",
  },
  authorized: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    zIndex: 100,
  },
  jwt: {
    padding: theme.spacing(1),
    fontFamily: "'Source Code Pro', monospace",
    lineHeight: 1.5,
    fontSize: 14,
    width: "650px",
  },
}));

const HTTP_PATTERN = /^http:\/\//i;
const HTTPS_PATTERN = /^https:\/\//i;

const RequestFields: React.FC = () => {
  const classes = useStyles();
  const [urlError, setUrlError] = useState<string | null>(null);
  const [bodyError, setBodyError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<any>(null);
  const [showCancel, setShowCancel] = useState<boolean>(false);
  const [jwtAnchor, setJwtAnchor] = useState<HTMLButtonElement | null>(null);
  const [request, { setRequestValue, send, cancel, reset }] = useRequest();
  const [jwt] = useJwt();
  const [loading] = useLoading();

  const handleFieldChange = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setRequestValue(name, event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (!loading && event.key === "Enter") {
      handleSend();
    }
  };

  const validateUrl = () => {
    const url = _.trim(request.url);

    if (url.length === 0) {
      setUrlError("Url is required");
      return false;
    }

    if (!HTTP_PATTERN.test(url) && !HTTPS_PATTERN.test(url)) {
      setUrlError("Url must include protocol - http:// or https://");
      return false;
    }

    setUrlError(null);
    return true;
  };

  const isFormPost = (): boolean => {
    return (
      isRequestBodyAllowed(request.method) &&
      _.includes([MULTIPART_FORM_DATA.value, X_WWW_FORM_URLENCODED.value], request.contentType)
    );
  };

  const getRequestBodyTooltip = () => {
    return isFormPost() ? (
      <>
        <Typography variant="caption">To send form data, enter as JSON. eg:</Typography>
        <pre className={classes.tooltipCode}>{`{ 
  "email": "user@example.com",
  "password": "Passw0rd1" 
}`}</pre>
      </>
    ) : (
      ""
    );
  };

  const validateBody = () => {
    let error = null;
    if (isFormPost()) {
      try {
        JSON.parse(request.body);
      } catch (e) {
        error = `Unable to parse form data. ${e.message}`;
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
      <Grid item xs={12} xl={6} className={classes.gridItem}>
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
          FormHelperTextProps={{
            className: classes.error,
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
          {httpMethods.map((method) => (
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
          {contentTypes.map((contentType) => (
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
          <Paper square variant="outlined" className={classes.headers}>
            {jwt && (
              <Tooltip arrow title={<Typography variant="caption">Show JSON web token</Typography>}>
                <IconButton
                  aria-label="Authorization"
                  className={classes.authorized}
                  onClick={(event: MouseEvent<HTMLButtonElement>) => {
                    setJwtAnchor(event.currentTarget);
                  }}
                >
                  <VerifiedUserIcon fontSize="default" />
                </IconButton>
              </Tooltip>
            )}
            <WrappedAceEditor
              mode="properties"
              value={request.headers}
              minLines={3}
              maxLines={10}
              maxLength={10_000}
              readOnly={false}
              onChange={(value: string) => {
                setRequestValue("headers", value);
              }}
            />
          </Paper>
        </Tooltip>
      </Grid>

      <Popover
        open={Boolean(jwtAnchor)}
        anchorEl={jwtAnchor}
        onClose={() => setJwtAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper square variant="outlined" className={classes.jwt}>
          <WrappedAceEditor mode="json" value={jwt} readOnly={true} showGutter={false} />
        </Paper>
      </Popover>

      {isRequestBodyAllowed(request.method) && (
        <Grid item xs={12} className={classes.gridItem}>
          <InputLabel className={classes.label} error={bodyError != null}>
            Request body
          </InputLabel>
          <Tooltip
            arrow
            placement="top"
            classes={{ tooltip: classes.tooltip }}
            title={getRequestBodyTooltip()}
            enterDelay={500}
            enterNextDelay={500}
          >
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
          </Tooltip>
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
