import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import _ from 'lodash';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    cell: {
        fontSize: 16,
        fontFamily: '\'Inconsolata\', monospace',
    },
}));

const ResponseHeaders = (props) => {
    const classes = useStyles();
    const {headers} = props;

    return (
        <TableContainer>
            <Table className={classes.root} size="small" aria-label="Response headers">
                <TableBody>
                    {_.map(headers, (headerValue, headerName) => (
                        <TableRow key={headerName}>
                            <TableCell className={classes.cell}>
                                {headerName}
                            </TableCell>
                            <TableCell className={classes.cell}>
                                {headerValue}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ResponseHeaders;
