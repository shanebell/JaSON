angular.module('JaSON')
    .controller('appController', function ($scope, $log, $http, $filter, $window, historyService, referenceData) {

        $log.info('     _       ____   ___  _   _\n    | | __ _/ ___| / _ \\| \\ | |\n _  | |/ _` \\___ \\| | | |  \\| |\n| |_| | (_| |___) | |_| | |\\  |\n \\___/ \\__,_|____/ \\___/|_| \\_| v%s\n\nhttps://github.com/shanebell/JaSON\n\n', referenceData.version);

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
                        ctrl.response = processHttpReponse(response);
                    },
                    function (response) {
                        ctrl.response = processHttpReponse(response);
                    }
                ).finally(function () {
                    ctrl.response.time = new Date();

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
            ctrl.request = historyItem.request;
            ctrl.response = historyItem.response;
            ctrl.activeRequestTab = 0;
            $window.scrollTo(0, 0);
        };

        // TODO check if request content is allowed for other content types
        ctrl.requestBodyAllowed = function () {
            return _.includes([ 'POST', 'PUT', 'PATCH' ], ctrl.request.method);
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
            return ctrl.history.limit += 50;
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

            if (ctrl.request.contentType == 'application/x-www-form-urlencoded; charset=UTF-8' && ctrl.request.body) {
                httpConfig.params = JSON.parse(ctrl.request.body);
            } else {
                httpConfig.data = ctrl.request.body;
            }

            return httpConfig;
        }

        function processHttpReponse(response) {

            // convert headers to an array of name/value pairs
            response.headers = _.map(response.headers(), function(value, name) {
                return { name: name, value: value};
            });

            // convert data to JSON string
            if (_.isObject(response.data)) {
                response.data = $filter('json')(response.data);
            }

            return response;
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

                historyService.save(historyItem).then(
                    function() {
                        loadHistory();
                    },
                    function(error) {
                        $log.error('Error saving history item: %s', angular.toJson(error, true));
                    }
                );

            }
        }

        function loadHistory() {
            historyService.getHistory().then(
                function (response) {
                    ctrl.history.items = response;
                },
                function (response) {
                    $log.error('Error loading history from local storage: %s', angular.toJson(response, true));
                }
            );
        }

        (function() {
            loadHistory()
        })();

    }
);