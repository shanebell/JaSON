import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { BugReport } from "@material-ui/icons";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(4),
    position: "absolute",
    bottom: "0",
    right: "0",
  },
  details: {
    marginTop: theme.spacing(2),
  },
  box: {
    padding: theme.spacing(2),
  },
}));

const colorVariants: any[] = [
  "primary.main",
  "secondary.main",
  "error.main",
  "warning.main",
  "info.main",
  "success.main",
  "text.primary",
  "text.secondary",
];

const typographyVariants: any[] = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "subtitle1",
  "subtitle2",
  "body1",
  "body2",
  "caption",
  "button",
  "overline",
  "srOnly",
  "inherit",
];

const ThemeDebug: React.FC = () => {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);

  return (
    <div className={classes.root}>
      <Button
        startIcon={<BugReport />}
        variant="contained"
        size="small"
        onClick={() => (visible ? setVisible(false) : setVisible(true))}
      >
        {visible ? "Hide" : "Show"} theme debug
      </Button>

      {visible && (
        <div className={classes.details}>
          <Typography component="div" variant="body1">
            {colorVariants.map((color) => (
              <Box key={color} bgcolor={color} color="white" className={classes.box}>
                {color}
              </Box>
            ))}
          </Typography>
          {typographyVariants.map((variant) => (
            <Box key={variant}>
              <Typography key={variant} variant={variant}>
                This is {variant}
              </Typography>
            </Box>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeDebug;
