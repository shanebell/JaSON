import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import RefreshIcon from '@material-ui/icons/Refresh';
import MenuItem from '@material-ui/core/MenuItem';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import React, {useState} from 'react';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import RequestHeaders from './RequestHeaders';
import TabPanel from './TabPanel';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(2),
    },
    tabs: {
        marginBottom: theme.spacing(2),
    },
    monospace: {
        fontFamily: '\'Inconsolata\', monospace',
    },
}));

const HTTP_METHODS = [
    {
        name: 'GET',
        value: 'GET',
        bodyAllowed: false,
    },
    {
        name: 'POST',
        value: 'POST',
        bodyAllowed: true,
    },
    {
        name: 'PUT',
        value: 'PUT',
        bodyAllowed: true,
    },
    {
        name: 'PATCH',
        value: 'PATCH',
        bodyAllowed: true,
    },
    {
        name: 'DELETE',
        value: 'DELETE',
        bodyAllowed: false,
    },
    {
        name: 'HEAD',
        value: 'HEAD',
        bodyAllowed: false,
    },
    {
        name: 'OPTIONS',
        value: 'OPTIONS',
        bodyAllowed: false,
    },
];

const CONTENT_TYPES = [
    {
        name: 'JSON (application/json)',
        value: 'application/json',
    },
    {
        name: 'XML (text/xml)',
        value: 'text/xml',
    },
    {
        name: 'XML (application/xml)',
        value: 'application/xml',
    },
    {
        name: 'Form encoded',
        value: 'application/x-www-form-urlencoded',
    },
];

const defaultRequestValues: any = {
    url: 'https://httpbin.org/post',
    method: 'POST',
    contentType: 'application/json',
    body: '{ \n' +
        '  "name1": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lacinia non purus a varius. Donec bibendum varius purus non volutpat. Nunc vel congue tortor, nec mollis arcu. Sed varius ante sed dictum pellentesque. Maecenas vel neque interdum, gravida elit et, aliquet dolor.",\n' +
        '  "name2": 10,\n' +
        '  "name3": false\n' +
        '}',
    headers: [],
};

const RequestFields: React.FC<{onSend: any, loading: boolean}> = ({onSend, loading}) => {
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState(0);
    const [requestValues, setRequestValues] = useState(defaultRequestValues);

    function handleTabChange(event: any, newValue: number) {
        setActiveTab(newValue);
    }

    const handleReset = () => {
        setRequestValues(defaultRequestValues);
    };

    const isRequestBodyAllowed = () => {
        return _.find(HTTP_METHODS, {value: requestValues.method}).bodyAllowed;
    };

    const handleChange = (name: string) => (event: any) => {
        setRequestValues({...requestValues, [name]: event.target.value});
    };

    const onHeadersChange = (headers: any[]) => {
        setRequestValues({...requestValues, headers});
    };

    const sendRequest = () => {
        onSend(requestValues);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="Request details"
                    className={classes.tabs}
                >
                    <Tab label="HTTP request"/>
                    <Tab label="Headers"/>
                </Tabs>
                <TabPanel isActive={activeTab === 0}>
                    <TextField
                        id="url"
                        label="Url"
                        margin="dense"
                        required
                        fullWidth
                        InputProps={{
                            className: classes.monospace
                        }}
                        value={requestValues.url}
                        autoFocus
                        onChange={handleChange('url')}
                    />

                    <TextField
                        id="method"
                        label="Method"
                        margin="dense"
                        select
                        required
                        fullWidth
                        InputProps={{
                            className: classes.monospace
                        }}
                        value={requestValues.method}
                        onChange={handleChange('method')}
                    >
                        {HTTP_METHODS.map(method => (
                            <MenuItem
                                key={method.value}
                                value={method.value}
                                dense
                            >
                                {method.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="content-type"
                        label="Content type"
                        margin="dense"
                        select
                        required
                        fullWidth
                        InputProps={{
                            className: classes.monospace
                        }}
                        value={requestValues.contentType}
                        onChange={handleChange('contentType')}
                    >
                        {CONTENT_TYPES.map(contentType => (
                            <MenuItem
                                key={contentType.value}
                                value={contentType.value}
                                dense
                            >
                                {contentType.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </TabPanel>

                <TabPanel isActive={activeTab === 1}>
                    <RequestHeaders
                        headers={requestValues.headers}
                        onChange={onHeadersChange}
                    />
                </TabPanel>
            </Grid>

            <Grid item xs={8}>
                <TextField
                    id="body"
                    label="Request body"
                    fullWidth
                    disabled={!isRequestBodyAllowed()}
                    InputProps={{
                        className: classes.monospace
                    }}
                    value={requestValues.body}
                    onChange={handleChange('body')}
                    multiline
                    rows={10}
                    variant="outlined"
                />
            </Grid>

            <Grid item xs={12}>
                <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    disabled={loading}
                    className={classes.button}
                    onClick={sendRequest}
                    endIcon={<SendIcon/>}
                >
                    Send request
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    disabled={loading}
                    className={classes.button}
                    onClick={handleReset}
                    endIcon={<RefreshIcon/>}
                >
                    Reset fields
                </Button>
            </Grid>
        </Grid>
    );
};

export default RequestFields;
