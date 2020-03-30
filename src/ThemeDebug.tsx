import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {BugReport} from '@material-ui/icons';
import React, {Fragment, useState} from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(20),
        padding: theme.spacing(2),
    },
    typography: {
        display: 'block',
    },
}));

const typographyVariants: any[] = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'button',
    'overline',
    'srOnly',
    'inherit'
];

const ThemeDebug: React.FC = () => {
    const classes = useStyles();
    const [visible, setVisible] = useState(false);

    return (
        <div className={classes.root}>
            <Button
                startIcon={<BugReport/>}
                variant="contained"
                size="small"
                onClick={() => visible ? setVisible(false) : setVisible(true)}
            >
                { visible ? 'Hide' : 'Show' } theme debug
            </Button>

            {visible &&
            <Fragment>
                <Typography component="div" variant="body1">
                    <Box color="primary.main">primary.main</Box>
                    <Box color="secondary.main">secondary.main</Box>
                    <Box color="error.main">error.main</Box>
                    <Box color="warning.main">warning.main</Box>
                    <Box color="info.main">info.main</Box>
                    <Box color="success.main">success.main</Box>
                    <Box color="text.primary">text.primary</Box>
                    <Box color="text.secondary">text.secondary</Box>
                    <Box color="text.disabled">text.disabled</Box>
                </Typography>
                {typographyVariants.map((variant) => (
                    <Typography
                        key={variant}
                        className={classes.typography}
                        variant={variant}
                    >
                        This is {variant}
                    </Typography>
                ))}
            </Fragment>
            }
        </div>
    );
};

export default ThemeDebug;