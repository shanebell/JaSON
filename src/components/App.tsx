import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import "typeface-inconsolata";
import "typeface-roboto";
import Loading from "./Loading";
import CssBaseline from "@material-ui/core/CssBaseline";
import Navigation from "./Navigation";
import RequestFields from "./RequestFields";
import ResponseFields from "./ResponseFields";
import ThemeDebug from "./ThemeDebug";
import config from "../config";
import useApplicationState from "../state";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

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
      main: "#fba875",
    },
    secondary: {
      main: "#b07466",
    },
  },
  light: {
    type: "light",
    primary: {
      main: "#515570",
    },
    secondary: {
      main: "#f85565",
    },
  },
};

consoleMessage();

const App = () => {
  const classes = useStyles();
  const [state] = useApplicationState();
  const theme = createMuiTheme({
    spacing: 4,
    palette: palette[state.theme],
  });
  return (
    <ThemeProvider theme={theme}>
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
