import Chip from "@material-ui/core/Chip";
import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import HttpResponse from "../types/HttpResponse";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    color: theme.palette.text.secondary,
    borderColor: theme.palette.text.secondary,
  },
}));

const ResponseTime: React.FC<{ response: HttpResponse }> = ({ response }) => {
  const classes = useStyles();

  if (response.startTime > 0 && response.endTime > 0) {
    const timeInMillis = response.endTime - response.startTime;
    return <Chip className={classes.root} label={`${timeInMillis} ms`} size="small" variant="outlined" />;
  } else {
    return null;
  }
};

export default ResponseTime;
