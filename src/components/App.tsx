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

const colorSchemes = [
  { primary: "#fba875", secondary: "#b07466" }, // default for "dark" theme
  { primary: "#515570", secondary: "#f85565" }, // default for "light" theme
  { primary: "#d7d8dd", secondary: "#b07466" },
  { primary: "#fba875", secondary: "#d7d8dd" },
  { primary: "#d7d8dd", secondary: "#fba875" },
  { primary: "#ffbb94", secondary: "#d7d8dd" },
  { primary: "#d7d8dd", secondary: "#ffbb94" },
  // { primary: "#ffbb94", secondary: "#515570" },
  // { primary: "#e16428", secondary: "#f6e9e9" },
  // { primary: "#f8615a", secondary: "#ffd868" },
  // { primary: "#ff6363", secondary: "#ffbd69" },
  // { primary: "#ffa34d", secondary: "#f67575" },
];

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
    // palette: {
    //   type: state.theme,
    //   primary: {
    //     main: colorSchemes[state.colorScheme].primary,
    //   },
    //   secondary: {
    //     main: colorSchemes[state.colorScheme].secondary,
    //   },
    // },
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
