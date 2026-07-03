import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import "@fontsource/source-code-pro";
import "@fontsource/roboto";
import CssBaseline from "@mui/material/CssBaseline";
import Navigation from "./Navigation";
import RequestFields from "./RequestFields";
import ResponseFields from "./ResponseFields";
import config from "../config";
import { PaletteOptions } from "@mui/material/styles";
import { useTheme } from "../state";
import Grid from "@mui/material/Grid";
import HistorySearch from "./HistorySearch";
import HistoryList from "./HistoryList";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => ({
  container: {
    paddingTop: `calc(64px + ${theme.spacing(4)})`,
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
    paddingRight: theme.spacing(2),
  },
  gridColumnRight: {
    height: "100%",
    overflowY: "scroll",
  },
}));

const consoleMessage = () => {
  console.info(`JaSON v${config.version}`);
};

const palette: Record<string, PaletteOptions> = {
  dark: {
    mode: "dark",
    primary: {
      main: "#d7d8dd",
    },
    secondary: {
      main: "#b07466",
    },
  },
  light: {
    mode: "light",
    primary: {
      main: "#515570",
    },
    secondary: {
      main: "#b07466",
    },
  },
};

consoleMessage();

const AppContent: React.FC = () => {
  const { classes } = useStyles();
  return (
    <Container maxWidth={false} className={classes.container}>
      <Grid container spacing={4} className={classes.gridContainer}>
        <Grid size={{ xs: 8, xl: 9 }} className={classes.gridColumnLeft}>
          <RequestFields />
          <Divider className={classes.divider} />
          <ResponseFields />
        </Grid>
        <Grid size={{ xs: 4, xl: 3 }} className={classes.gridColumnRight}>
          <HistorySearch />
          <HistoryList />
        </Grid>
      </Grid>
    </Container>
  );
};

const App = () => {
  const [theme] = useTheme();

  const muiTheme = createTheme({
    spacing: 4,
    palette: palette[theme],
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Navigation />
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
