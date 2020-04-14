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
import ResponseTime from "./ResponseTime";

const useStyles = makeStyles((theme) => ({
  responseTabs: {
    marginBottom: theme.spacing(4),
  },
  response: {
    padding: theme.spacing(2),
  },
  rawResponse: {
    padding: theme.spacing(2),
  },
  headers: {
    padding: theme.spacing(2),
  },
  code: {
    fontFamily: "'Inconsolata', monospace",
    whiteSpace: "pre-wrap",
  },
  chips: {
    position: "absolute",
    right: theme.spacing(2),
    marginTop: theme.spacing(1),
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className={classes.chips}>
          <StatusCode status={state.response.status} />
          <ResponseTime response={state.response} />
        </div>

        <Tabs
          className={classes.responseTabs}
          value={state.responseTab}
          onChange={handleTabChange}
          aria-label="Response details"
        >
          <Tab label="Response" />
          <Tab label="Raw response" />
          <Tab label="Headers" />
        </Tabs>

        {/* FORMATTED RESPONSE */}
        <TabPanel isActive={state.responseTab === 0 && state.response.data}>
          <Paper className={classes.response} variant="outlined">
            <code className={classes.code}>{formatResponse(state.response)}</code>
          </Paper>
        </TabPanel>

        {/* RAW RESPONSE */}
        <TabPanel isActive={state.responseTab === 1 && state.response.data}>
          <Paper className={classes.rawResponse} variant="outlined">
            <code className={classes.code}>{formatRawResponse(state.response)}</code>
          </Paper>
        </TabPanel>

        {/* RESPONSE HEADERS */}
        <TabPanel isActive={state.responseTab === 2 && state.response.data}>
          <Paper className={classes.headers} variant="outlined">
            <ResponseHeaders headers={state.response.headers} />
          </Paper>
        </TabPanel>
      </Grid>
    </Grid>
  );
};

export default ResponseFields;
