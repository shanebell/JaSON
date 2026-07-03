import { Divider } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Chip from "@mui/material/Chip";
import ListItemText from "@mui/material/ListItemText";
import { makeStyles } from "tss-react/mui";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Delete, Favorite, FavoriteBorder } from "@mui/icons-material";
import React, { ChangeEvent, useEffect } from "react";
import _ from "lodash";
import { useHistory } from "../state";
import FormattedDate from "./FormattedDate";
import { HISTORY_SEARCH_LIMIT } from "../historyService";

const useStyles = makeStyles()((theme) => ({
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
  const { classes } = useStyles();
  const [history, { selectHistoryItem, removeHistoryItem, favouriteHistoryItem, migrateHistory }] = useHistory();

  useEffect(migrateHistory, [migrateHistory]);

  return (
    <>
      {_.isEmpty(history) && <div className={classes.message}>No results</div>}

      <List dense>
        {history.map((historyItem) => (
          <div key={historyItem.id}>
            <ListItemButton dense alignItems="flex-start" onClick={() => selectHistoryItem(historyItem)}>
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
                        size="small"
                        variant="outlined"
                      />
                      {historyItem.status && (
                        <Chip
                          className={classes.chip}
                          label={historyItem.status}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      <Typography component="span" variant="caption" className={`${classes.trim} ${classes.date}`}>
                        <FormattedDate date={historyItem.date} />
                      </Typography>
                    </>
                  }
                  slotProps={{
                    secondary: { component: "span" },
                  }}
                />
              </Tooltip>
              <div className={classes.actions}>
                <Tooltip arrow title={historyItem.favourite ? "Remove from favourites" : "Add to favourites"}>
                  <Checkbox
                    size="small"
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    checked={historyItem.favourite === 1}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      favouriteHistoryItem(historyItem, event.target.checked)
                    }
                  />
                </Tooltip>
                <Tooltip arrow title="Delete from history">
                  <IconButton aria-label="delete" onClick={(e) => { e.stopPropagation(); removeHistoryItem(historyItem); }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            </ListItemButton>
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
