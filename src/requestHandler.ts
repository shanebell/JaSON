import _ from 'lodash';
import axios from 'axios';

// prefix request.URL with "http://" if it's not already present
const addProtocolIfMissing = (request) => {
    if (!_.isEmpty(request.url) && !/^http(s)?:\/\//.test(request.url)) {
        request.url = `http://${request.url}`;
    }
};

const processResponse = (response, meta, onResponse) => {
    meta.endTime = Date.now();
    response.meta = meta;
    console.log('response: %o', response);
    onResponse(response);
};

export const sendRequest = async (request, onResponse) => {
    addProtocolIfMissing(request);

    const options = {
        url: request.url,
        method: request.method,
        headers: {
            'Content-Type': request.contentType,
        },
    };

    // TODO handle duplicate header names
    _.forEach(request.headers, (header) => {
        options.headers[header.name] = header.value;
    });

    if (!_.isEmpty(request.body)) {
        options.data = request.body;
    }

    console.log('options: %o', options);

    const meta = {
        startTime: Date.now(),
    };

    try {
        const response = await axios(options);
        processResponse(response, meta, onResponse);
    } catch (error) {
        processResponse(error.response, meta, onResponse);
    }

};