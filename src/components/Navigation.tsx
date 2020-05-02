import { Tooltip } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DarkThemeIcon from "@material-ui/icons/Brightness4";
import LightThemeIcon from "@material-ui/icons/Brightness7";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import About from "./About";
import logo from "../images/jason.png";
import { useApplicationState } from "../state";
import Loading from "./Loading";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    fontWeight: 300,
    color: theme.palette.primary.main,
  },
  logo: {
    height: "48px",
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
}));

const Navigation: React.FC = () => {
  const classes = useStyles();
  const [{ theme, aboutOpen }, { toggleTheme, showAbout, hideAbout }] = useApplicationState();

  return (
    <AppBar position="fixed" color="inherit">
      <Toolbar>
        <img src={logo} alt="JaSON logo" className={classes.logo} />
        <Typography variant="h5" className={classes.title}>
          JaSON
        </Typography>
        <Tooltip arrow title="Toggle light/dark theme" aria-label="Toggle light/dark theme">
          <IconButton onClick={() => toggleTheme()}>
            {theme === "dark" ? <LightThemeIcon /> : <DarkThemeIcon />}
          </IconButton>
        </Tooltip>
        <Button color="inherit" onClick={() => showAbout()}>
          About
        </Button>
      </Toolbar>
      <About open={aboutOpen} onClose={() => hideAbout()} />
      <Loading />
    </AppBar>
  );
};

export default Navigation;
