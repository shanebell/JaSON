import LinearProgress from '@material-ui/core/LinearProgress';
import {makeStyles} from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    progress: {
        height: theme.spacing(0.5),
    },
}));

const Loading = (props) => {
    const classes = useStyles();
    const {loading} = props;

    return loading
        ? <LinearProgress className={classes.progress}/>
        : <div className={classes.progress}/>
};

export default Loading;
