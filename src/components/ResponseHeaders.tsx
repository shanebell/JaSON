import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import _ from "lodash";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    fontSize: 16,
    fontFamily: "'Inconsolata', monospace",
  },
  tableRow: {
    "&:last-child td": {
      borderBottom: 0,
    },
  },
}));

const ResponseHeaders: React.FC<{ headers: any }> = ({ headers }) => {
  const classes = useStyles();

  return (
    <TableContainer>
      <Table className={classes.root} size="small" aria-label="Response headers">
        <TableBody>
          {_.map(headers, (headerValue: any, headerName: string) => (
            <TableRow key={headerName} className={classes.tableRow}>
              <TableCell>{headerName}</TableCell>
              <TableCell>{headerValue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResponseHeaders;
