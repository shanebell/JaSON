import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import React, { Fragment } from "react";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";

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

const RequestHeaders: React.FC<{ headers: any[]; onChange: any }> = ({ headers, onChange }) => {
  const classes = useStyles();

  const addHeader = () => {
    const newHeaders = [...headers, { name: "", value: "" }];
    onChange(newHeaders);
  };

  const removeHeader = (header: any) => {
    const updatedHeaders = _.without(headers, header);
    onChange(updatedHeaders);
  };

  const handleChange = (name: string, index: number) => (event: any) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][name] = event.target.value;
    onChange(updatedHeaders);
  };

  return (
    <div>
      <Button variant="outlined" size="small" color="default" onClick={addHeader} className={classes.button}>
        Add header
      </Button>

      <Grid container spacing={1}>
        {_.map(headers, (header, index) => (
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
                value={headers[index].name}
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
                value={headers[index].value}
              />
            </Grid>
            <Grid item xs={2} className={classes.remove}>
              <IconButton size="small" onClick={() => removeHeader(header)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </div>
  );
};

export default RequestHeaders;
