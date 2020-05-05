import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import { createMuiTheme, makeStyles, Theme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import "typeface-source-code-pro";
import "typeface-roboto";
import CssBaseline from "@material-ui/core/CssBaseline";
import Navigation from "./Navigation";
import RequestFields from "./RequestFields";
import ResponseFields from "./ResponseFields";
import ThemeDebug from "./ThemeDebug";
import config from "../config";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { useTheme } from "../state";
import { Grid } from "@material-ui/core";
import HistoryList from "./HistoryList";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: 64 + theme.spacing(2),
    height: "100%",
  },
  divider: {
    margin: theme.spacing(2, 2),
  },
  gridContainer: {
    height: "100%",
  },
  gridColumnLeft: {
    height: "100%",
    overflowY: "scroll",
    paddingRight: `${theme.spacing(2)}px !important`,
  },
  gridColumnRight: {
    height: "100%",
    overflowY: "scroll",
  },
}));

const consoleMessage = () => {
  console.log(`JaSON v${config.version}`);
};

const palette: Record<string, PaletteOptions> = {
  dark: {
    type: "dark",
    primary: {
      // main: "#fba875",
      main: "#d7d8dd",
    },
    secondary: {
      main: "#b07466",
      // main: "#fba875",
    },
  },
  light: {
    type: "light",
    primary: {
      main: "#515570",
    },
    secondary: {
      main: "#b07466",
    },
  },
};

consoleMessage();

const App = () => {
  const classes = useStyles();
  const [theme] = useTheme();

  const muiTheme = createMuiTheme({
    spacing: 4,
    palette: palette[theme],
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Navigation />
      <Container maxWidth={false} className={classes.container}>
        <Grid container spacing={4} className={classes.gridContainer}>
          <Grid item xs={8} xl={9} className={classes.gridColumnLeft}>
            <RequestFields />
            <Divider className={classes.divider} />
            <ResponseFields />
          </Grid>
          <Grid item xs={4} xl={3} className={classes.gridColumnRight}>
            <HistoryList />
          </Grid>
        </Grid>
      </Container>
      <ThemeDebug />
    </ThemeProvider>
  );
};

export default App;
