import Grid from "@material-ui/core/Grid";
import SendIcon from "@material-ui/icons/Send";
import RefreshIcon from "@material-ui/icons/Refresh";
import MenuItem from "@material-ui/core/MenuItem";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import React from "react";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import RequestHeaders from "./RequestHeaders";
import TabPanel from "./TabPanel";
import useApplicationState from "../state";
import HttpMethod from "../types/HttpMethod";
import ContentType from "../types/ContentType";

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
}));

const RequestFields: React.FC = () => {
  const classes = useStyles();
  const [state, actions] = useApplicationState();

  const handleTabChange = (event: any, newValue: number) => {
    actions.setRequestTab(newValue);
  };

  const isRequestBodyAllowed = () => {
    return _.find(HTTP_METHODS, { value: state.request.method })?.bodyAllowed || false;
  };

  const handleFieldChange = (name: string) => (event: any) => {
    actions.updateRequestValues(name, event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      actions.send();
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <Tabs value={state.requestTab} onChange={handleTabChange} aria-label="Request details" className={classes.tabs}>
          <Tab label="HTTP request" />
          <Tab label="Headers" />
        </Tabs>
        <TabPanel isActive={state.requestTab === 0}>
          <TextField
            id="url"
            label="Url"
            margin="dense"
            required
            fullWidth
            InputProps={{
              className: classes.monospace,
            }}
            onKeyDown={handleKeyDown}
            value={state.request.url}
            autoFocus
            onChange={handleFieldChange("url")}
          />

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
            value={state.request.method}
            onChange={handleFieldChange("method")}
          >
            {HTTP_METHODS.map((method) => (
              <MenuItem key={method.value} value={method.value} dense>
                {method.name}
              </MenuItem>
            ))}
          </TextField>

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
            value={state.request.contentType}
            onChange={handleFieldChange("contentType")}
          >
            {CONTENT_TYPES.map((contentType) => (
              <MenuItem key={contentType.value} value={contentType.value} dense>
                {contentType.name}
              </MenuItem>
            ))}
          </TextField>
        </TabPanel>

        <TabPanel isActive={state.requestTab === 1}>
          <RequestHeaders />
        </TabPanel>
      </Grid>

      <Grid item xs={8}>
        <TextField
          id="body"
          label="Request body"
          fullWidth
          disabled={!isRequestBodyAllowed()}
          InputProps={{
            className: classes.monospace,
          }}
          value={state.request.body}
          onChange={handleFieldChange("body")}
          multiline
          rows={10}
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12} className={classes.actions}>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          disabled={state.loading}
          className={classes.button}
          onClick={actions.send}
          endIcon={<SendIcon />}
        >
          Send request
        </Button>
        <Button
          variant="outlined"
          size="small"
          disabled={state.loading}
          className={classes.button}
          onClick={actions.reset}
          endIcon={<RefreshIcon />}
        >
          Reset fields
        </Button>
      </Grid>
    </Grid>
  );
};

export default RequestFields;
