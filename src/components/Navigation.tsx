import { Theme, Tooltip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Brightness4 as DarkThemeIcon } from "@mui/icons-material";
import { Brightness7 as LightThemeIcon } from "@mui/icons-material";
import { makeStyles } from "tss-react/mui";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import About from "./About";
import logo from "../images/jason.png";
import { useTheme } from "../state";
import Loading from "./Loading";

const useStyles = makeStyles()((theme: Theme) => ({
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
  const { classes } = useStyles();
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [theme, { toggleTheme }] = useTheme();

  const showAbout = () => {
    setAboutOpen(true);
  };

  const hideAbout = () => {
    setAboutOpen(false);
  };

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
