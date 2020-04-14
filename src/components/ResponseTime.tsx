import Chip from "@material-ui/core/Chip";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import HttpResponse from "../types/HttpResponse";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
}));

const ResponseTime: React.FC<{ response: HttpResponse }> = ({ response }) => {
  const classes = useStyles();

  if (response.startTime > 0 && response.endTime > 0) {
    const timeInMillis = response.endTime - response.startTime;
    return (
      <Chip className={classes.root} label={`${timeInMillis} ms`} size="small" variant="outlined" color="primary" />
    );
  } else {
    return null;
  }
};

export default ResponseTime;
