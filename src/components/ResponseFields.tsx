import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React from "react";
import StatusCode from "./StatusCode";
import TabPanel from "./TabPanel";
import { useApplicationState } from "../state";
import ResponseTime from "./ResponseTime";
import ResponseData from "./ResponseData";
import ResponseHeaders from "./ResponseHeaders";

const useStyles = makeStyles((theme) => ({
  responseTabs: {
    marginBottom: theme.spacing(4),
  },
  chips: {
    position: "absolute",
    right: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  grid: {
    position: "relative",
  },
}));

const ResponseFields: React.FC = () => {
  const classes = useStyles();
  const [state, actions] = useApplicationState();

  const handleTabChange = (event: any, newValue: number) => {
    actions.setResponseTab(newValue);
  };

  return (
    <Grid container spacing={2} className={classes.grid}>
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
          <Tab label="Response data" />
          <Tab label="Raw response" />
          <Tab label="Response headers" />
        </Tabs>

        {/* FORMATTED RESPONSE */}
        <TabPanel isActive={state.responseTab === 0 && state.response.data}>
          <Paper square variant="outlined">
            <ResponseData response={state.response} />
          </Paper>
        </TabPanel>

        {/* RAW RESPONSE */}
        <TabPanel isActive={state.responseTab === 1 && state.response.data}>
          <Paper square variant="outlined">
            <ResponseData response={state.response} formatted={false} />
          </Paper>
        </TabPanel>

        {/* RESPONSE HEADERS */}
        <TabPanel isActive={state.responseTab === 2 && state.response.data}>
          <Paper square variant="outlined">
            <ResponseHeaders headers={state.response.headers} />
          </Paper>
        </TabPanel>
      </Grid>
    </Grid>
  );
};

export default ResponseFields;
