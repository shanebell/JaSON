import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import useApplicationState from "../state";
import React from "react";

const useStyles = makeStyles((theme) => ({
  progress: {
    height: theme.spacing(0.5),
  },
}));

const Loading: React.FC = () => {
  const classes = useStyles();
  const [state] = useApplicationState();

  return state.loading ? <LinearProgress className={classes.progress} /> : <div className={classes.progress} />;
};

export default Loading;
