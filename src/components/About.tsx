import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import config from "../config";
import "typeface-roboto";
import logo from "../images/jason.png";
import { TransitionProps } from "@material-ui/core/transitions/transition";

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 300,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  logo: {
    display: "flex",
    justifyContent: "center",
    margin: theme.spacing(2),
  },
  img: {
    width: "128px",
    height: "128px",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
  },
}));

const paragraphStyles = makeStyles((theme) => ({
  paragraph: {
    padding: theme.spacing(1),
  },
  link: {
    color: theme.palette.primary.main,
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Paragraph: React.FC<{ text?: string; href: string; target: string; linkText: string }> = ({
  text,
  href,
  target,
  linkText,
}) => {
  const classes = paragraphStyles();
  return (
    <Typography variant="body1" align="center" className={classes.paragraph}>
      {text}{" "}
      <a href={href} target={target} className={classes.link}>
        {linkText}
      </a>
    </Typography>
  );
};

const About: React.FC<{ open: boolean; onClose: React.ReactEventHandler }> = ({ open, onClose }) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onBackdropClick={onClose}
      onEscapeKeyDown={onClose}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="alert-dialog-title" disableTypography className={classes.title}>
        <Typography align="center" variant="h6">
          JaSON
        </Typography>
        <Typography align="center" variant="body2">
          v{config.version}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContent id="alert-dialog-description" className={classes.content} dividers>
          <div className={classes.logo}>
            <img src={logo} alt="JaSON logo" className={classes.img} />
          </div>
          <Paragraph
            text="Developed and maintained by"
            href="mailto:shane.bell@gmail.com"
            target="_mail"
            linkText="Shane Bell"
          />
          <Paragraph
            text="Licensed under the"
            href="http://www.apache.org/licenses/LICENSE-2.0"
            target="_license"
            linkText="Apache License v2.0"
          />
          <Paragraph
            text="Available from the"
            href="https://chrome.google.com/webstore/detail/jason/oealdlhfjifhgbmjnenhkgffglaibojf"
            target="_webstore"
            linkText="Chrome Web Store"
          />
          <Paragraph
            text="Source code available at"
            href="https://github.com/shanebell/JaSON"
            target="_github"
            linkText="GitHub"
          />
          <Paragraph
            href="https://chrome.google.com/webstore/detail/jason/oealdlhfjifhgbmjnenhkgffglaibojf/support"
            target="_issue"
            linkText="Report an issue"
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

export default About;
