angular.module('JaSON')
    .controller('historyController', function ($scope, $log, historyService) {

        var ctrl = this;

        ctrl.model = {
            searchTerm: ''
        };

        ctrl.historyItems = [];

        historyService.getHistory().then(
            function (response) {
                ctrl.historyItems = response;
            },
            function (response) {
                $log.debug('Error loading history from local storage: %s', angular.toJson(response));
            }
        );

        ctrl.clearHistory = function () {
            historyService.clearHistory();
            ctrl.historyItems = [];
        };

        ctrl.getHostname = function (urlString) {
            var url = new URL(urlString);
            return url.hostname;
        };

        ctrl.getPath = function (urlString) {
            var hostname = ctrl.getHostname(urlString);
            return _.replace(urlString, hostname, '');
        };


    });
