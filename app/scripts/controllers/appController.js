angular.module('JaSON')
    .controller('appController', function ($scope, $log, $http, httpService, historyService, referenceData) {

        $log.debug('     _       ____   ___  _   _\n    | | __ _/ ___| / _ \\| \\ | |\n _  | |/ _` \\___ \\| | | |  \\| |\n| |_| | (_| |___) | |_| | |\\  |\n \\___/ \\__,_|____/ \\___/|_| \\_| v%s\n\nhttps://github.com/shanebell/JaSON\n\n', referenceData.version);

        var ctrl = this;

        // reference data
        ctrl.httpMethods = referenceData.httpMethods;
        ctrl.contentTypes = referenceData.contentTypes;
        ctrl.requestBodyPlaceholder = referenceData.requestBodyPlaceholder;

        ctrl.loading = false;
        ctrl.activeRequestTab = 0;
        ctrl.activeResponseTab = 0;

        ctrl.history = defaultHistory();
        ctrl.request = defaultRequest();
        ctrl.response = {};

        ctrl.addHeader = function () {
            ctrl.request.headers.push({name: '', value: ''});
        };

        ctrl.removeHeader = function (header) {
            ctrl.request.headers = _.without(ctrl.request.headers, header);
        };

        ctrl.getStatusText = function(statusCode) {
            return referenceData.responseCodes[statusCode];
        };

        ctrl.sendRequest = function () {

            ctrl.response = {};

            if (ctrl.form.$invalid) {
                ctrl.showErrors = true;
            } else {
                ctrl.loading = true;

                addProtocolIfMissing();
                ctrl.request.time = new Date();

                $http(buildHttpConfig()).then(
                    function (response) {
                        $log.debug('Response: %s', angular.toJson(response));
                        ctrl.response = response;
                    },
                    function (response) {
                        $log.debug('Error: %s', angular.toJson(response));
                        ctrl.response = response;
                    }
                ).finally(function () {
                    ctrl.response.time = new Date();

                    ctrl.response.headers = _.map(ctrl.response.headers(), function(value, name) {
                        return { name: name, value: value};
                    });

                    saveHistoryItem();

                    ctrl.loading = false;
                    ctrl.activeResponseTab = 0;
                });

            }
        };

        ctrl.resetFields = function () {
            ctrl.request = defaultRequest();
            ctrl.response = {};
            ctrl.activeRequestTab = 0;
            ctrl.activeResponseTab = 0;
        };

        ctrl.loadHistoryItem = function(historyItem) {
            $log.info('Loading history item: %s', angular.toJson(historyItem, true));
            ctrl.request = historyItem.request;
            ctrl.response = historyItem.response;
            ctrl.activeRequestTab = 0;
        };

        // TODO check if request content is allowed for other content types
        ctrl.requestBodyAllowed = function () {
            return ctrl.request.method == 'POST' || ctrl.request.method == 'PUT';
        };

        ctrl.getLength = function() {
            if (ctrl.response) {
                var contentLength = _.find(ctrl.response.headers(), function(headerValue, headerName) {
                    return headerName == 'content-length';
                });
                return contentLength || 0;
            }
            return 0;
        };

        ctrl.historyFilter = function(historyItem) {
            return _.isEmpty(ctrl.history.search) || _.includes(historyItem.request.url, ctrl.history.search);
        };

        ctrl.showMore = function() {
            return ctrl.history.limit < ctrl.history.items.length && _.isEmpty(ctrl.history.search);
        };

        ctrl.getDuration = function() {
            return new Date(ctrl.response.time) - new Date(ctrl.request.time);
        };

        ctrl.clearHistory = function () {
            historyService.clearHistory();
            ctrl.history = defaultHistory();
        };

        function defaultRequest() {
            return {
                url: 'https://httpbin.org/ip',
                method: _.head(ctrl.httpMethods),
                contentType: _.head(ctrl.contentTypes).value,
                headers: [],
                body: ''
            };
        }

        function defaultHistory() {
            return {
                items: [],
                search: '',
                limit: 50
            }
        }

        function addProtocolIfMissing() {

            // prefix URL with "http://" if it's not already present
            if (!_.isEmpty(ctrl.request.url) && !/^http(s)?:\/\//.test(ctrl.request.url)) {
                ctrl.request.url = sprintf('http://%s', ctrl.request.url);
            }
        }

        function buildHttpConfig() {

            var headers = {
                'Content-Type': ctrl.request.contentType
            };

            // remove empty headers
            ctrl.request.headers = _.filter(ctrl.request.headers, function(header) {
                return header.name && header.value;
            });

            _.forEach(ctrl.request.headers, function (header) {
                headers[header.name] = header.value;
            });

            var httpConfig = {
                method: ctrl.request.method,
                url: ctrl.request.url,
                headers: headers
            };

            if (ctrl.requestBodyAllowed()) {
                httpConfig.data = ctrl.request.body;
            }

            return httpConfig;
        }

        /**
         * Save the current request data to the history
         */
        function saveHistoryItem() {

            // only save valid responses
            if (ctrl.response.status !== -1) {

                var historyItem = {
                    request: ctrl.request,
                    response: ctrl.response
                };

                $log.debug('Saving history item %s', angular.toJson(historyItem, true));

                historyService.save(historyItem).then(
                    function() {
                        historyService.getHistory().then(
                            function(historyItems) {
                                ctrl.history.items = historyItems;
                            }
                        );
                    },
                    function(error) {
                        $log.debug('Error saving history item: %s', error);
                    }
                );

            }
        }

        (function() {
            $log.debug('Loading history...');
            historyService.getHistory().then(
                function (response) {
                    $log.debug('%s history items loaded', response.length);
                    ctrl.history.items = response;
                },
                function (response) {
                    $log.debug('Error loading history from local storage: %s', angular.toJson(response));
                }
            );
        })();

    }
);