import { Divider, Theme } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { Delete, Favorite, FavoriteBorder } from "@material-ui/icons";
import React from "react";
import _ from "lodash";
import { useHistory } from "../state";
import FormattedDate from "./FormattedDate";

const useStyles = makeStyles((theme: Theme) => ({
  noResults: {
    padding: theme.spacing(4),
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
    whiteSpace: "nowrap",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
  },
  tooltip: {
    maxWidth: 500,
  },
}));

const HistoryList: React.FC = () => {
  const classes = useStyles();
  const [history, { selectHistoryItem, removeHistoryItem }] = useHistory();

  // TODO remove logging
  console.log("HistoryList render");

  return (
    <>
      {_.isEmpty(history) && <div className={classes.noResults}>No results</div>}

      {/* HISTORY ITEMS */}
      <List dense>
        {history.map((historyItem) => (
          <div key={historyItem.id}>
            <ListItem dense button alignItems="flex-start" onClick={() => selectHistoryItem(historyItem)}>
              <Tooltip
                arrow
                enterDelay={250}
                enterNextDelay={250}
                classes={{ tooltip: classes.tooltip }}
                title={<Typography variant="caption">{historyItem.url}</Typography>}
                aria-label={historyItem.url}
              >
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
                        <FormattedDate date={historyItem.date} />
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
                <IconButton aria-label="delete" onClick={() => removeHistoryItem(historyItem)}>
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
