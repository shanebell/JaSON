import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import config from "../config";
import "typeface-roboto";
import logo from "../images/jason.png";
import { mdiBug, mdiGithub, mdiGoogleChrome, mdiLicense, mdiCreativeCommons } from "@mdi/js";
import Icon from "@mdi/react";
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
    width: "200px",
    height: "200px",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
  },
}));

const paragraphStyles = makeStyles((theme: Theme) => ({
  paragraph: {
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: theme.palette.text.secondary,
  },
  icon: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(1),
  },
  image: {
    width: "36px",
    height: "36px",
    padding: theme.spacing(1),
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Paragraph: React.FC<{
  text?: any;
  href: string;
  target: string;
  linkText: string;
  icon?: string;
  image?: any;
}> = ({ text, href, target, linkText, icon, image }) => {
  const classes = paragraphStyles();
  return (
    <Typography variant="body1" align="center" className={classes.paragraph}>
      {icon && <Icon path={icon} title={linkText} size={1.5} className={classes.icon} />}
      {image && <img src={image} alt="JaSON logo" className={classes.image} />}
      <div>
        {text}
        &nbsp;
        <a href={href} target={target} className={classes.link}>
          {linkText}
        </a>
      </div>
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
            icon={mdiGithub}
            text="View the source code on"
            href="https://github.com/shanebell/JaSON"
            target="_github"
            linkText="GitHub"
          />
          <Paragraph
            icon={mdiGoogleChrome}
            text="Available from the"
            href="https://chrome.google.com/webstore/detail/jason/oealdlhfjifhgbmjnenhkgffglaibojf"
            target="_webstore"
            linkText="Chrome Web Store"
          />
          <Paragraph
            icon={mdiBug}
            href="https://chrome.google.com/webstore/detail/jason/oealdlhfjifhgbmjnenhkgffglaibojf/support"
            target="_issue"
            text="Contact the developer to"
            linkText="report an issue"
          />
          <Paragraph
            icon={mdiLicense}
            text="Licensed under the"
            href="http://www.apache.org/licenses/LICENSE-2.0"
            target="_license"
            linkText="Apache License v2.0"
          />
          <Paragraph
            image={logo}
            text="Jason Voorhees icon by"
            href="http://laurareen.com/"
            target="_laurareen"
            linkText="Laura Reen"
          />
          <Paragraph
            icon={mdiCreativeCommons}
            text="Icon licensed under the"
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_creativecommons"
            linkText="CC Attribution license"
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
