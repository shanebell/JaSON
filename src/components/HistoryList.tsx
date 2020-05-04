import { Divider, Menu, MenuItem, Theme } from "@material-ui/core";
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
import { Delete, Favorite, FavoriteBorder, MoreVert, Search } from "@material-ui/icons";
import React, { useState } from "react";
import _ from "lodash";
import HistoryItem from "../types/HistoryItem";
import FormControl from "@material-ui/core/FormControl";
import { useHistory } from "../state";

const useStyles = makeStyles((theme: Theme) => ({
  search: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  searchIcon: {
    color: theme.palette.grey[600],
  },
  searchInput: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
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
  small: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    fontSize: theme.spacing(4),
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
  const [history, { clearHistory, selectHistoryItem, removeHistoryItem }] = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const open = Boolean(anchorEl);

  const showMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const hideMenu = () => {
    setAnchorEl(null);
  };

  const clearAll = () => {
    clearHistory();
    hideMenu();
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredHistory = _.filter(history, (historyItem: HistoryItem) => {
    const term = searchTerm.trim().toLowerCase();
    return _.isEmpty(term)
      ? true
      : historyItem.url.toLowerCase().includes(term) ||
          historyItem.method.toLowerCase().includes(term) ||
          historyItem.body.toLowerCase().includes(term);
  });

  return (
    <>
      {/* HISTORY ACTIONS */}
      <FormControl fullWidth className={classes.search}>
        <TextField
          label="Search request history"
          InputProps={{
            className: classes.searchInput,
            startAdornment: (
              <InputAdornment position="start">
                <Search className={classes.searchIcon} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={showMenu}>
                  <MoreVert fontSize="small" />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={hideMenu}>
                  <MenuItem onClick={clearAll}>Clear all history items</MenuItem>
                </Menu>
              </InputAdornment>
            ),
          }}
          inputProps={{
            padding: "18px",
          }}
          value={searchTerm}
          onChange={handleSearch}
        />
      </FormControl>

      {_.isEmpty(filteredHistory) && <div className={classes.noResults}>No results</div>}

      {/* HISTORY ITEMS */}
      <List dense>
        {filteredHistory.map((historyItem) => (
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
