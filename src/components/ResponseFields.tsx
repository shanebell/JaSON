import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React from "react";
import AceEditor from "react-ace";
import _ from "lodash";
import ResponseHeaders from "./ResponseHeaders";
import StatusCode from "./StatusCode";
import TabPanel from "./TabPanel";
import useApplicationState from "../state";
import HttpResponse from "../types/HttpResponse";
import ResponseTime from "./ResponseTime";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import "ace-builds/src-noconflict/theme-merbivore_soft";
import "ace-builds/src-noconflict/theme-mono_industrial";

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

const ACE_EDITOR_MODES: Record<string, string> = {
  "application/json": "json",
  "text/json": "json",
  "application/xml": "xml",
  "text/xml": "xml",
  "text/html": "html",
  "application/html": "html",
};

const getEditorMode = (response: HttpResponse) => {
  const editorMode = _.find(ACE_EDITOR_MODES, (mode, contentType) => {
    return _.startsWith(contentType, response.contentType);
  });
  return editorMode || "text";
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
            {/* themes: mono_industrial, merbivore_soft, ambiance, clouds_midnight  */}
            <AceEditor
              mode={getEditorMode(state.response)}
              theme="mono_industrial"
              fontSize={16}
              name="formatted-response"
              width="100%"
              maxLines={100}
              readOnly
              wrapEnabled
              value={formatResponse(state.response)}
              setOptions={{
                useWorker: false,
                showLineNumbers: false,
                showPrintMargin: false,
                // @ts-ignore
                foldStyle: "markbeginend",
                fontFamily: "'Source Code Pro', monospace",
              }}
            />
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
