import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { makeStyles } from "tss-react/mui";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React from "react";
import StatusCode from "./StatusCode";
import TabPanel from "./TabPanel";
import { useResponse } from "../state";
import ResponseTime from "./ResponseTime";
import ResponseData from "./ResponseData";
import ResponseHeaders from "./ResponseHeaders";

const useStyles = makeStyles()((theme) => ({
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
  const { classes } = useStyles();
  const [{ response, responseTab }, { setResponseTab }] = useResponse();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setResponseTab(newValue);
  };

  return (
    <Grid container spacing={2} className={classes.grid}>
      <Grid size={12}>
        <div className={classes.chips}>
          <StatusCode status={response.status} />
          <ResponseTime response={response} />
        </div>

        <Tabs
          className={classes.responseTabs}
          value={responseTab}
          onChange={handleTabChange}
          aria-label="Response details"
        >
          <Tab label="Response data" />
          <Tab label="Raw response" />
          <Tab label="Response headers" />
        </Tabs>

        {/* FORMATTED RESPONSE */}
        <TabPanel isActive={responseTab === 0 && response.data}>
          <Paper square variant="outlined">
            <ResponseData response={response} />
          </Paper>
        </TabPanel>

        {/* RAW RESPONSE */}
        <TabPanel isActive={responseTab === 1 && response.data}>
          <Paper square variant="outlined">
            <ResponseData response={response} formatted={false} />
          </Paper>
        </TabPanel>

        {/* RESPONSE HEADERS */}
        <TabPanel isActive={responseTab === 2 && response.headers}>
          <Paper square variant="outlined">
            <ResponseHeaders headers={response.headers} />
          </Paper>
        </TabPanel>
      </Grid>
    </Grid>
  );
};

export default ResponseFields;
