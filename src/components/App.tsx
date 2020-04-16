import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import "typeface-source-code-pro";
import "typeface-roboto";
import Loading from "./Loading";
import CssBaseline from "@material-ui/core/CssBaseline";
import Navigation from "./Navigation";
import RequestFields from "./RequestFields";
import ResponseFields from "./ResponseFields";
import ThemeDebug from "./ThemeDebug";
import config from "../config";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import useApplicationState from "../state";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(2),
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
  const [state] = useApplicationState();
  console.log("state: %o", state);

  const muiTheme = createMuiTheme({
    spacing: 4,
    palette: palette[state.theme],
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Navigation />
      <Loading />
      <Container maxWidth={false} className={classes.container}>
        <RequestFields />
        <Divider className={classes.divider} />
        <ResponseFields />
      </Container>
      <ThemeDebug />
    </ThemeProvider>
  );
};

export default App;
