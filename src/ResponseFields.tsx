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
import { AxiosResponse } from "axios";

const useStyles = makeStyles((theme) => ({
  root: {},
  responseTabs: {
    marginBottom: theme.spacing(4),
  },
  response: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
  },
  rawResponse: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
  },
  headers: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
  },
  code: {
    fontFamily: "'Inconsolata', monospace",
    whiteSpace: "pre-wrap",
  },
}));

const isJsonResponse = (response: AxiosResponse): boolean => {
  return response && response.headers && _.isEqual("application/json", response.headers["content-type"]);
};

const formatRawResponse = (response: AxiosResponse): string => {
  return response?.request?.responseText || "";
};

const formatResponse = (response: AxiosResponse): string => {
  // TODO handle other content types
  if (isJsonResponse(response)) {
    return JSON.stringify(response.data, null, 2);
  }
  return formatRawResponse(response);
};

const ResponseFields: React.FC<{ response: any }> = ({ response }) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event: any, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12}>
        <Tabs
          className={classes.responseTabs}
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Response details"
        >
          <Tab label="Response" />
          <Tab label="Raw response" />
          <Tab label="Headers" />

          {/* Status code */}
          <StatusCode status={response.status} />
        </Tabs>

        {/* Formatted response */}
        <TabPanel isActive={activeTab === 0 && response.data}>
          <Paper className={classes.response} variant="outlined">
            <code className={classes.code}>{formatResponse(response)}</code>
          </Paper>
        </TabPanel>

        {/* Raw response */}
        <TabPanel isActive={activeTab === 1 && response.data}>
          <Paper className={classes.rawResponse} variant="outlined">
            <code className={classes.code}>{formatRawResponse(response)}</code>
          </Paper>
        </TabPanel>

        {/* Response headers */}
        <TabPanel isActive={activeTab === 2 && response.data}>
          <Paper className={classes.headers} variant="outlined">
            <ResponseHeaders headers={response.headers} />
          </Paper>
        </TabPanel>
      </Grid>
    </Grid>
  );
};

export default ResponseFields;
