import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import { FormControlLabel, Switch } from "@material-ui/core";
import useApplicationState from "../state";

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 300,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
  },
  darkMode: {
    justifyContent: "center",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
}));

const Transition: React.ComponentType<TransitionProps> = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Settings: React.FC<{ open: boolean; onClose: React.ReactEventHandler }> = ({ open, onClose }) => {
  const classes = useStyles();
  const [state, actions] = useApplicationState();

  const handleThemeChange = (event: any) => {
    actions.setTheme(event.target.checked ? "dark" : "light");
  };

  return (
    <Dialog
      open={open}
      onBackdropClick={onClose}
      onEscapeKeyDown={onClose}
      TransitionComponent={Transition}
      aria-labelledby="settings-dialog-title"
      aria-describedby="settings-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="settings-dialog-title" disableTypography className={classes.title}>
        <Typography align="center" variant="h6">
          Settings
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContent id="alert-dialog-description" className={classes.content} dividers>
          <FormControlLabel
            className={classes.darkMode}
            control={
              <Switch
                checked={state.theme === "dark"}
                onChange={handleThemeChange}
                name="dark"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            }
            label="Dark mode"
          />
        </DialogContent>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings;
