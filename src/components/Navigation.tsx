import { Tooltip } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import DarkThemeIcon from "@material-ui/icons/Brightness4";
import LightThemeIcon from "@material-ui/icons/Brightness7";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import HistoryIcon from "@material-ui/icons/History";
import React, { useState } from "react";
import About from "./About";
import HistoryList from "./HistoryList";
// import logo from "../images/icon-128x128.png";
import logo from "../images/jason.png";
import useApplicationState from "../state";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    fontWeight: 300,
    color: theme.palette.primary.main,
  },
  logo: {
    height: "48px",
    marginRight: theme.spacing(2),
  },
}));

const Navigation: React.FC = () => {
  const classes = useStyles();
  const [aboutOpen, showAbout] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [state, actions] = useApplicationState();

  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <Tooltip arrow title="Request history" aria-label="Request history">
          <IconButton color="inherit" aria-label="open drawer" onClick={() => setDrawerOpen(true)} edge="start">
            <HistoryIcon />
          </IconButton>
        </Tooltip>
        <img src={logo} alt="JaSON logo" className={classes.logo} />
        <Typography variant="h5" className={classes.title}>
          JaSON
        </Typography>
        <Tooltip arrow title="Toggle light/dark theme" aria-label="Toggle light/dark theme">
          <IconButton onClick={() => actions.toggleTheme()}>
            {state.theme === "dark" ? <LightThemeIcon /> : <DarkThemeIcon />}
          </IconButton>
        </Tooltip>
        <Button color="inherit" onClick={() => showAbout(true)}>
          About
        </Button>
      </Toolbar>
      <About open={aboutOpen} onClose={() => showAbout(false)} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <HistoryList />
      </Drawer>
    </AppBar>
  );
};

export default Navigation;
