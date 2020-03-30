import LinearProgress from '@material-ui/core/LinearProgress';
import {makeStyles} from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    progress: {
        height: theme.spacing(0.5),
    },
}));

const Loading: React.FC<{loading: boolean}> = ({loading}) => {
    const classes = useStyles();

    return loading
        ? <LinearProgress className={classes.progress}/>
        : <div className={classes.progress}/>
};

export default Loading;
