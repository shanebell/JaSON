import { Menu, MenuItem, Theme, Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Favorite, FavoriteBorder, MoreVert, Search } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { useHistoryFilter } from "../state";
import Checkbox from "@material-ui/core/Checkbox";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) => ({
  filters: {
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
  const [clearHistoryDialogOpen, setClearHistoryDialogOpen] = useState<boolean>(false);
  const [{ searchTerm, showFavourites }, { searchHistory, clearHistory, setHistoryFilter }] = useHistoryFilter();

  const showMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const hideMenu = () => {
    setAnchorEl(null);
  };

  const showClearHistoryDialog = () => {
    hideMenu();
    setClearHistoryDialogOpen(true);
  };

  const hideClearHistoryDialog = () => {
    setClearHistoryDialogOpen(false);
  };

  const clearAll = () => {
    clearHistory();
    hideClearHistoryDialog();
  };

  // debounce the history search to prevent excessive re-renders
  const debounceSearch = useRef(
    _.debounce(() => {
      searchHistory();
    }, 250)
  );

  // debounce search when searchTerm changes
  useEffect(() => debounceSearch.current(), [searchTerm]);

  // search immediately when showFavourites changes
  useEffect(() => searchHistory(), [showFavourites, searchHistory]);

  return (
    <div className={classes.filters}>
      <TextField
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
              <Tooltip arrow title="Show favourites">
                <Checkbox
                  checked={showFavourites}
                  size="small"
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  onChange={(event) => setHistoryFilter("showFavourites", event.target.checked)}
                  color="default"
                />
              </Tooltip>
              <Tooltip arrow title="More options...">
                <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={showMenu}>
                  <MoreVert fontSize="small" />
                </IconButton>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={anchorEl != null} onClose={hideMenu}>
                <MenuItem onClick={showClearHistoryDialog}>
                  <ListItemText>Clear request history</ListItemText>
                </MenuItem>
              </Menu>
            </InputAdornment>
          ),
        }}
        value={searchTerm}
        onChange={(event) => setHistoryFilter("searchTerm", event.target.value)}
      />
      <Dialog
        open={clearHistoryDialogOpen}
        onClose={hideClearHistoryDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="confirm-dialog-title">Clear request history?</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            This will delete all items (including favourites) from your history.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={hideClearHistoryDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={clearAll} color="primary" autoFocus>
            Clear history
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HistorySearch;
