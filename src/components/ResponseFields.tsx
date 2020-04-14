import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React from "react";
import _ from "lodash";
import ResponseHeaders from "./ResponseHeaders";
import StatusCode from "./StatusCode";
import TabPanel from "./TabPanel";
import useApplicationState from "../state";
import HttpResponse from "../types/HttpResponse";

const useStyles = makeStyles((theme) => ({
  root: {},
  responseTabs: {
    marginBottom: theme.spacing(4),
  },
  response: {
    padding: theme.spacing(2),
    // backgroundColor: theme.palette.grey[50],
  },
  rawResponse: {
    padding: theme.spacing(2),
    // backgroundColor: theme.palette.grey[50],
  },
  headers: {
    padding: theme.spacing(2),
    // backgroundColor: theme.palette.grey[50],
  },
  code: {
    fontFamily: "'Inconsolata', monospace",
    whiteSpace: "pre-wrap",
  },
}));

const isJsonResponse = (response: HttpResponse): boolean => {
  return response && _.isEqual("application/json", response.contentType);
};

const formatRawResponse = (response: HttpResponse): string => {
  return response?.responseText || "";
};

const formatResponse = (response: HttpResponse): string => {
  // TODO handle other content types
  if (isJsonResponse(response)) {
    return JSON.stringify(response.data, null, 2);
  }
  return formatRawResponse(response);
};

const ResponseFields: React.FC = () => {
  const classes = useStyles();
  const [state, actions] = useApplicationState();

  const handleTabChange = (event: any, newValue: number) => {
    actions.setResponseTab(newValue);
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12}>
        <Tabs
          className={classes.responseTabs}
          value={state.requestTab}
          onChange={handleTabChange}
          aria-label="Response details"
        >
          <Tab label="Response" />
          <Tab label="Raw response" />
          <Tab label="Headers" />
          <StatusCode status={state.response.status} />
        </Tabs>

        {/* FORMATTED RESPONSE */}
        <TabPanel isActive={state.requestTab === 0 && state.response.data}>
          <Paper className={classes.response} variant="outlined">
            <code className={classes.code}>{formatResponse(state.response)}</code>
          </Paper>
        </TabPanel>

        {/* RAW RESPONSE */}
        <TabPanel isActive={state.requestTab === 1 && state.response.data}>
          <Paper className={classes.rawResponse} variant="outlined">
            <code className={classes.code}>{formatRawResponse(state.response)}</code>
          </Paper>
        </TabPanel>

        {/* RESPONSE HEADERS */}
        <TabPanel isActive={state.requestTab === 2 && state.response.data}>
          <Paper className={classes.headers} variant="outlined">
            <ResponseHeaders headers={state.response.headers} />
          </Paper>
        </TabPanel>
      </Grid>
    </Grid>
  );
};

export default ResponseFields;
