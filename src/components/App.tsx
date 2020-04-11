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

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(2),
  },
}));

const theme = createMuiTheme({
  spacing: 4,
  palette: {
    primary: {
      main: "#d9230f",
    },
    background: {
      default: "#fff",
    },
  },
});

const consoleMessage = () => {
  console.log(`JaSON v${config.version}`);
};

consoleMessage();

const App = () => {
  const classes = useStyles();
  const [state] = useApplicationState();
  console.log("State: %o", state);

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
