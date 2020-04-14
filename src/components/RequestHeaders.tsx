import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import React, { Fragment } from "react";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import HttpHeader from "../types/HttpHeader";
import useApplicationState from "../state";

const useStyles = makeStyles((theme) => ({
  button: {
    marginBottom: theme.spacing(1),
  },
  remove: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  monospace: {
    fontFamily: "'Inconsolata', monospace",
  },
}));

const RequestHeaders: React.FC = () => {
  const classes = useStyles();
  const [state, actions] = useApplicationState();

  const addHeader = () => {
    const updatedHeaders: HttpHeader[] = [...state.request.headers, { name: "", value: "" }];
    actions.updateRequestValues("headers", updatedHeaders);
  };

  const removeHeader = (header: any) => {
    const updatedHeaders: HttpHeader[] = _.without(state.request.headers, header);
    actions.updateRequestValues("headers", updatedHeaders);
  };

  const handleChange = (name: string, index: number) => (event: any) => {
    const updatedHeaders: any = [...state.request.headers];
    updatedHeaders[index][name] = event.target.value;
    actions.updateRequestValues("headers", updatedHeaders);
  };

  return (
    <div>
      <Button variant="outlined" size="small" color="default" onClick={addHeader} className={classes.button}>
        Add header
      </Button>

      <Grid container spacing={1}>
        {_.map(state.request.headers, (header, index) => (
          <Fragment key={index}>
            <Grid item xs={5}>
              <TextField
                label="Name"
                fullWidth
                InputProps={{
                  className: classes.monospace,
                }}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                  margin: "dense",
                }}
                required
                margin="dense"
                size="small"
                onChange={handleChange("name", index)}
                value={state.request.headers[index].name}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Value"
                fullWidth
                InputProps={{
                  className: classes.monospace,
                }}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                  margin: "dense",
                }}
                required
                margin="dense"
                size="small"
                onChange={handleChange("value", index)}
                value={state.request.headers[index].value}
              />
            </Grid>
            <Grid item xs={2} className={classes.remove}>
              <IconButton onClick={() => removeHeader(header)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </div>
  );
};

export default RequestHeaders;
