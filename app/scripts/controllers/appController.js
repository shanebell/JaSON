angular.module('JaSON')
    .controller('appController', ['$scope', '$log', '$http', 'httpService', 'Data',
        function ($scope, $log, $http, httpService, Data) {

            $log.debug('     _       ____   ___  _   _\n    | | __ _/ ___| / _ \\| \\ | |\n _  | |/ _` \\___ \\| | | |  \\| |\n| |_| | (_| |___) | |_| | |\\  |\n \\___/ \\__,_|____/ \\___/|_| \\_| v2.0.0\n\nhttps://github.com/shanebell/JaSON\n\n');

            var ctrl = this;

            ctrl.httpMethods = Data.httpMethods;
            ctrl.contentTypes = Data.contentTypes;
            ctrl.requestBodyPlaceholder = Data.requestBodyPlaceholder;
            ctrl.loading = false;

            ctrl.model = defaultModel();

            ctrl.addHeader = function () {
                ctrl.model.headers.push({name: '', value: ''});
            };

            ctrl.removeHeader = function (header) {
                ctrl.model.headers = _.without(ctrl.model.headers, header);
            };

            ctrl.sendRequest = function () {

                // TODO refactor this into httpService

                var headers = {
                    'Content-Type': ctrl.model.contentType
                };

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
                var startTime = new Date().getTime();

                $http(httpConfig).then(
                    function(response) {
                        $log.debug('Response: %s', angular.toJson(response));
                        ctrl.model.response = response;
                    },
                    function(response) {
                        $log.debug('Error: %s', angular.toJson(response));
                        ctrl.model.response = response;
                    }
                ).finally(function() {
                    var endTime = new Date().getTime();
                    ctrl.model.response.time = endTime - startTime;
                    ctrl.loading = false;
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

        }]);

