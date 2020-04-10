import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import React, { useState } from "react";
import "typeface-inconsolata";
import "typeface-roboto";
import Loading from "./Loading";
import Navigation from "./Navigation";
import RequestFields from "./RequestFields";
import { sendRequest } from "./requestHandler";
import ResponseFields from "./ResponseFields";
import ThemeDebug from "./ThemeDebug";

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
  },
});

const consoleMessage = () => {
  console.log(`JaSON v5.0.0`);
};

consoleMessage();

const App = () => {
  const classes = useStyles();
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSend = (requestValues: any) => {
    setLoading(true);
    setResponse({});
    sendRequest(requestValues, (response: any) => {
      setResponse(response);
      setLoading(false);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Navigation />
      <Loading loading={loading} />
      <Container maxWidth={false} className={classes.container}>
        <RequestFields loading={loading} onSend={handleSend} />
        <Divider className={classes.divider} />
        <ResponseFields response={response} />
      </Container>
      <ThemeDebug />
    </ThemeProvider>
  );
};

export default App;
