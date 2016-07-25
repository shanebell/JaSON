angular.module('JaSON')
    .controller('appController', function ($scope, $log, $http, httpService, historyService, referenceData) {

        $log.debug('     _       ____   ___  _   _\n    | | __ _/ ___| / _ \\| \\ | |\n _  | |/ _` \\___ \\| | | |  \\| |\n| |_| | (_| |___) | |_| | |\\  |\n \\___/ \\__,_|____/ \\___/|_| \\_| v%s\n\nhttps://github.com/shanebell/JaSON\n\n', referenceData.version);

        var ctrl = this;

        ctrl.httpMethods = referenceData.httpMethods;
        ctrl.contentTypes = referenceData.contentTypes;
        ctrl.requestBodyPlaceholder = referenceData.requestBodyPlaceholder;
        ctrl.loading = false;
        ctrl.activeResponseTab = 0;

        ctrl.model = defaultModel();

        ctrl.addHeader = function () {
            ctrl.model.headers.push({name: '', value: ''});
        };

        ctrl.removeHeader = function (header) {
            ctrl.model.headers = _.without(ctrl.model.headers, header);
        };

        ctrl.getStatusText = function(statusCode) {
            return referenceData.responseCodes[statusCode];
        };

        ctrl.loadHistoryItem = function(historyItem) {
            $log.debug('loading history item: %s', angular.toJson(historyItem));
            ctrl.model = {
                url: historyItem.url,
                httpMethod: historyItem.method,
                contentType: historyItem.contentType,
                headers: historyItem.headers,
                requestBody: historyItem.requestBody || '',
                response: historyItem.responseBody
            }
        };

        ctrl.sendRequest = function () {

            // prefix URL with "http://" if it's not already present
            if (!_.isEmpty(ctrl.model.url) && !/^http(s)?:\/\//.test(ctrl.model.url)) {
                ctrl.model.url = sprintf('http://%s', ctrl.model.url);
            }

            if (ctrl.form.$invalid) {
                ctrl.showErrors = true;
                return;
            }

            // TODO refactor this into httpService

            var headers = {
                'Content-Type': ctrl.model.contentType
            };

            // remove empty filters
            ctrl.model.headers = _.filter(ctrl.model.headers, function(header) {
                return header.name && header.value;
            });

            _.forEach(ctrl.model.headers, function (header) {
                if (header.name && header.value) {
                    headers[header.name] = header.value;
                }
            });

            var httpConfig = {
                method: ctrl.model.httpMethod,
                url: ctrl.model.url,
                headers: headers
            };

            if (ctrl.requestBodyAllowed()) {
                httpConfig.data = ctrl.model.requestBody;
            }

            ctrl.loading = true;
            var start = new Date();

            $http(httpConfig).then(
                function (response) {
                    $log.debug('Response: %s', angular.toJson(response));
                    ctrl.model.response = response;
                },
                function (response) {
                    $log.debug('Error: %s', angular.toJson(response));
                    ctrl.model.response = response;
                }
            ).finally(function () {

                // calculate the time taken for this request
                var end = new Date();
                var time = end.getTime() - start.getTime();

                // add some custom fields to the response
                ctrl.model.response.time = time;

                // save the history item
                var historyItem = {

                    // request data
                    url: ctrl.model.url,
                    method: ctrl.model.httpMethod,
                    contentType: ctrl.model.contentType,
                    requestHeaders: headers,
                    requestBody: ctrl.model.requestBody,

                    // response data
                    responseBody: ctrl.model.response.data,
                    responseHeaders: ctrl.model.response.headers(),

                    // metadata
                    time: time,
                    date: start,
                    statusCode: ctrl.model.response.status,
                    statusText: ctrl.model.response.statusText

                };

                historyService.save(historyItem).then(
                    function() {
                        $log.debug('history item saved');

                        historyService.getHistory().then(
                            function(historyItems) {
                                ctrl.historyItems = historyItems;
                            }
                        );

                    },
                    function(error) {
                        $log.debug('Error saving history item: %s', error);
                    }
                );

                ctrl.loading = false;
                ctrl.activeResponseTab = 0;
            });
        };

        /**
         * Reset the form back to it's default state.
         */
        ctrl.resetFields = function () {
            ctrl.model = defaultModel();
        };

        /**
         * Used to determine whether the user can provide a request body based on
         * the current value of the HTTP method. eg: HTTP GET does not support a
         * request body.
         *
         * @returns {boolean} true if a request body is allowed, false otherwise.
         */
        ctrl.requestBodyAllowed = function () {

            // TODO check if request content is allowed for other content types
            return ctrl.model.httpMethod == 'POST' || ctrl.model.httpMethod == 'PUT';
        };

        ctrl.getLength = function() {
            if (ctrl.model.response) {
                var contentLength = _.find(ctrl.model.response.headers(), function(headerValue, headerName) {
                    return headerName == 'content-length';
                });
                return contentLength || 0;
            }
            return 0;
        };

        function defaultModel() {
            return {
                url: 'https://httpbin.org/ip',
                httpMethod: _.head(ctrl.httpMethods),
                contentType: _.head(ctrl.contentTypes).value,
                headers: [],
                requestBody: '',
                response: {},
                history: []
            };
        }

    }
);