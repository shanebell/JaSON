import { Divider, Button } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { Delete, Favorite, FavoriteBorder } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import useApplicationState, { HistoryItem } from "../state";

const useStyles = makeStyles((theme) => ({
  search: {
    margin: theme.spacing(4),
  },
  searchIcon: {
    color: theme.palette.grey[600],
  },
  clearHistory: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  },
  list: {
    // width: "100%",
    width: 400,
    maxWidth: 400,
  },
  method: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  date: {
    display: "inline !important",
    marginLeft: theme.spacing(2),
  },
  trim: {
    display: "block",
    maxWidth: "90%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  small: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    fontSize: theme.spacing(4),
  },
  actions: {
    display: "flex",
    flexDirection: "column",
  },
}));

const HistoryList: React.FC = () => {
  const classes = useStyles();
  const [state, actions] = useApplicationState();

  return (
    <>
      {/* HISTORY ACTIONS */}
      <TextField
        className={classes.search}
        label="Search request history"
        margin="dense"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className={classes.searchIcon} />
            </InputAdornment>
          ),
        }}
      />
      {state.history.length > 0 && (
        <Button className={classes.clearHistory} variant="outlined" onClick={() => actions.clearHistory()}>
          Clear history
        </Button>
      )}

      {/* HISTORY ITEMS */}
      <List dense className={classes.list}>
        {state.history.map((historyItem) => (
          <div key={historyItem.id}>
            <ListItem dense button alignItems="flex-start" onClick={() => actions.selectHistoryItem(historyItem)}>
              <Tooltip arrow enterDelay={250} title={historyItem.url} aria-label={historyItem.url}>
                <ListItemText
                  primary={<div className={classes.trim}>{historyItem.path}</div>}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" className={classes.trim}>
                        {historyItem.host}
                      </Typography>
                      <Chip
                        className={classes.method}
                        label={historyItem.method}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                      <Typography component="span" variant="caption" className={`${classes.trim} ${classes.date}`}>
                        {historyItem.date}
                      </Typography>
                    </>
                  }
                  secondaryTypographyProps={{
                    component: "span",
                  }}
                />
              </Tooltip>
              <ListItemSecondaryAction className={classes.actions}>
                {/* TODO implement "favourite" */}
                {false && <Checkbox size="small" icon={<FavoriteBorder />} checkedIcon={<Favorite />} value={false} />}
                <IconButton aria-label="delete" onClick={() => actions.removeHistoryItem(historyItem)}>
                  <Delete fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="fullWidth" component="li" />
          </div>
        ))}
      </List>
    </>
  );
};

export default HistoryList;
