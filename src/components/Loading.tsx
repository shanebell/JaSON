import LinearProgress from "@mui/material/LinearProgress";
import { makeStyles } from "tss-react/mui";
import { useLoading } from "../state";
import React from "react";

const useStyles = makeStyles()((theme) => ({
  progress: {
    height: theme.spacing(0.5),
  },
}));

const Loading: React.FC = () => {
  const { classes } = useStyles();
  const [loading] = useLoading();

  return loading ? <LinearProgress className={classes.progress} /> : <div className={classes.progress} />;
};

export default Loading;
