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
import React, { ChangeEvent, useEffect } from "react";
import _ from "lodash";
import { useHistory } from "../state";
import FormattedDate from "./FormattedDate";
import { HISTORY_SEARCH_LIMIT } from "../historyService";

const useStyles = makeStyles((theme: Theme) => ({
  message: {
    padding: theme.spacing(4),
  },
  chip: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  date: {
    display: "inline !important",
    marginLeft: theme.spacing(1),
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
  const [history, { selectHistoryItem, removeHistoryItem, favouriteHistoryItem, migrateHistory }] = useHistory();

  useEffect(migrateHistory, [migrateHistory]);

  return (
    <>
      {_.isEmpty(history) && <div className={classes.message}>No results</div>}

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
                        className={classes.chip}
                        label={historyItem.method}
                        color="default"
                        size="small"
                        variant="outlined"
                      />
                      {historyItem.status && (
                        <Chip
                          className={classes.chip}
                          label={historyItem.status}
                          color="default"
                          size="small"
                          variant="outlined"
                        />
                      )}
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
                <Checkbox
                  size="small"
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  checked={historyItem.favourite === 1}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    favouriteHistoryItem(historyItem, event.target.checked)
                  }
                />
                <IconButton aria-label="delete" onClick={() => removeHistoryItem(historyItem)}>
                  <Delete fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="fullWidth" component="li" />
          </div>
        ))}
      </List>
      {history.length === HISTORY_SEARCH_LIMIT && (
        <div className={classes.message}>Use search to find more history items</div>
      )}
    </>
  );
};

export default HistoryList;
