import { Tooltip } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import HistoryIcon from "@material-ui/icons/History";
import React, { useState } from "react";
import About from "./About";
import HistoryList from "./HistoryList";
import logo from "./images/icon-128x128.png";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    fontWeight: 300,
  },
  toolbar: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.grey[900],
  },
  logo: {
    height: "48px",
    padding: "4px 0",
  },
}));

const Navigation: React.FC = () => {
  const classes = useStyles();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar} variant="dense">
        <Tooltip arrow title="Request history" aria-label="Request history">
          <IconButton color="inherit" aria-label="open drawer" onClick={() => setDrawerOpen(true)} edge="start">
            <HistoryIcon />
          </IconButton>
        </Tooltip>
        <img src={logo} alt="JaSON logo" className={classes.logo} />
        <Typography variant="h5" className={classes.title}>
          JaSON
        </Typography>
        <Button color="inherit" onClick={() => setAboutOpen(true)}>
          About
        </Button>
      </Toolbar>
      <About open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <HistoryList />
      </Drawer>
    </AppBar>
  );
};

export default Navigation;
