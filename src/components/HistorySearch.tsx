import { Menu, MenuItem, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { MoreVert, Search } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { useSearchTerm } from "../state";

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
}));

const HistorySearch: React.FC = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, { setSearchTerm, searchHistory, clearHistory }] = useSearchTerm();

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

  // debounce the history search to prevent excessive re-renders
  const debounceSearch = useRef(
    _.debounce(() => {
      searchHistory();
    }, 250)
  );

  useEffect(() => debounceSearch.current(), [searchTerm]);

  return (
    <>
      {/* HISTORY ACTIONS */}
      <TextField
        className={classes.search}
        label="Search request history"
        fullWidth
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
              <Menu anchorEl={anchorEl} open={anchorEl != null} onClose={hideMenu}>
                <MenuItem onClick={clearAll}>
                  <ListItemText>Clear request history</ListItemText>
                </MenuItem>
              </Menu>
            </InputAdornment>
          ),
        }}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
    </>
  );
};

export default HistorySearch;
