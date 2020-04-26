import { Divider, ListItemAvatar } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
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

const useStyles = makeStyles((theme) => ({
  search: {
    margin: theme.spacing(4),
  },
  searchIcon: {
    color: theme.palette.grey[600],
  },
  list: {
    width: "100%",
    maxWidth: 400,
  },
  listItemAvatar: {
    minWidth: "48px",
  },
  method: {
    margin: `${theme.spacing(2)}px 0`,
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
}));

const history = [
  {
    id: "ac689307-ce26-4f5f-a8bf-14ab68c0b62e",
    url: "https://consent-api.appspot.com/api/customer/d4d21f61-b516-4045-841c-8ee58a87992d",
    path: "/api/customer/d4d21f61-b516-4045-841c-8ee58a87992d",
    domain: "https://consent-api.appspot.com",
    method: "GET",
    avatar: "G",
    date: "01/01/2020 12:00:00",
    favourite: true,
  },
  {
    id: "149df1f7-a764-45e3-a5ec-c33af7b8dc1d",
    url: "https://consent-api.appspot.com/api/customer",
    path: "/api/customer",
    domain: "https://consent-api.appspot.com",
    method: "POST",
    avatar: "T",
    date: "01/01/2020 12:00:00",
    favourite: false,
  },
  {
    id: "5badacd7-37dc-42d0-9fc2-fbe4f92c1a7a",
    url: "http://wwww.facebook.com/the/quick/brown/fox/jumps/over/the/lazy/dog",
    path: "/the/quick/brown/fox/jumps/over/the/lazy/dog",
    domain: "https://www.facebook.com",
    method: "DELETE",
    avatar: "F",
    date: "01/01/2020 12:00:00",
    favourite: false,
  },
];

const HistoryList: React.FC = () => {
  const classes = useStyles();

  const onHistorySelect = (historyItem: any) => {
    console.log(`onHistorySelect('${historyItem}`);
  };

  const onHistoryDelete = (historyItem: any) => {
    console.log(`onHistoryDelete('${historyItem}`);
  };

  return (
    <>
      {/* History actions */}
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

      {/* History items */}
      <List dense className={classes.list}>
        {history.map((historyItem) => (
          <div key={historyItem.id}>
            <ListItem dense button alignItems="flex-start" onClick={() => onHistorySelect(historyItem.id)}>
              {false && (
                <ListItemAvatar className={classes.listItemAvatar}>
                  <Avatar variant="circle" className={classes.small}>
                    {historyItem.avatar}
                  </Avatar>
                </ListItemAvatar>
              )}
              <Tooltip arrow enterDelay={250} title={historyItem.url} aria-label={historyItem.url}>
                <ListItemText
                  primary={<div className={classes.trim}>{historyItem.path}</div>}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" className={classes.trim}>
                        {historyItem.domain}
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
              <ListItemSecondaryAction>
                {false && (
                  <Checkbox
                    size="small"
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    value={historyItem.favourite}
                  />
                )}
                <IconButton aria-label="delete" onClick={() => onHistoryDelete(historyItem.id)}>
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
