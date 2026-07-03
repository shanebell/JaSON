import { Menu, MenuItem, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemText from "@mui/material/ListItemText";
import { makeStyles } from "tss-react/mui";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Favorite, FavoriteBorder, MoreVert, Search, Close } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { useHistoryFilter } from "../state";
import Checkbox from "@mui/material/Checkbox";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles()((theme) => ({
  filters: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  searchIcon: {
    color: theme.palette.grey[600],
  },
  tooltip: {
    maxWidth: 500,
  },
  tooltipCode: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: "bold",
    margin: 0,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const HistorySearch: React.FC = () => {
  const { classes } = useStyles();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [deleteHistoryDialogOpen, setDeleteHistoryDialogOpen] = useState<boolean>(false);
  const [includeFavourites, setIncludeFavourites] = useState<boolean>(false);
  const [{ searchTerm, showFavourites }, { searchHistory, clearHistory, setHistoryFilter }] = useHistoryFilter();

  const hasSearchTerm = () => {
    return searchTerm && searchTerm.trim().length > 0;
  };

  const clearSearchTerm = () => {
    setHistoryFilter("searchTerm", "");
  };

  const showMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const hideMenu = () => {
    setAnchorEl(null);
  };

  const showDeleteHistoryDialog = () => {
    hideMenu();
    setIncludeFavourites(false);
    setDeleteHistoryDialogOpen(true);
  };

  const hideDeleteHistoryDialog = () => {
    setDeleteHistoryDialogOpen(false);
  };

  const deleteHistory = () => {
    clearHistory(includeFavourites);
    hideDeleteHistoryDialog();
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
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip
                  arrow
                  classes={{ tooltip: classes.tooltip }}
                  title={
                    <>
                      <Typography variant="caption">Search on any combination of URL, method or status. eg:</Typography>
                      <pre className={classes.tooltipCode}>mydomain.com POST 500</pre>
                    </>
                  }
                >
                  <Search className={classes.searchIcon} />
                </Tooltip>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {hasSearchTerm() && (
                  <Tooltip
                    arrow
                    classes={{ tooltip: classes.tooltip }}
                    title={<Typography variant="caption">Clear search term</Typography>}
                  >
                    <IconButton aria-label="clear" onClick={clearSearchTerm}>
                      <Close fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip
                  arrow
                  classes={{ tooltip: classes.tooltip }}
                  title={<Typography variant="caption">Show favourites</Typography>}
                >
                  <Checkbox
                    checked={showFavourites}
                    size="small"
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    onChange={(event) => setHistoryFilter("showFavourites", event.target.checked)}
                  />
                </Tooltip>
                <Tooltip
                  arrow
                  title={<Typography variant="caption">More options...</Typography>}
                  classes={{ tooltip: classes.tooltip }}
                >
                  <IconButton onClick={showMenu}>
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={anchorEl != null} onClose={hideMenu}>
                  <MenuItem onClick={showDeleteHistoryDialog}>
                    <ListItemText>Delete request history</ListItemText>
                  </MenuItem>
                </Menu>
              </InputAdornment>
            ),
          },
        }}
        value={searchTerm}
        onChange={(event) => setHistoryFilter("searchTerm", event.target.value)}
      />

      <Dialog
        open={deleteHistoryDialogOpen}
        onClose={hideDeleteHistoryDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="confirm-dialog-title">Delete request history?</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete all items from your request history?</p>
          <p>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeFavourites}
                  onChange={() => setIncludeFavourites(!includeFavourites)}
                  color="primary"
                />
              }
              label="Delete favourites?"
            />
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={hideDeleteHistoryDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteHistory} color="primary" autoFocus>
            Delete history
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HistorySearch;
