angular.module('JaSON')
    .controller('historyController', function ($scope, $log, historyService) {

        var ctrl = this;

        ctrl.model = {
            searchTerm: '',
            limit: 50
        };

        ctrl.historyItems = [];

        historyService.getHistory().then(
            function (response) {
                $log.debug('%s history items loaded', response.length);
                ctrl.historyItems = response;
            },
            function (response) {
                $log.debug('Error loading history from local storage: %s', angular.toJson(response));
            }
        );

        ctrl.filter = function(historyItem) {
            var matchesFilter = true;

            if (ctrl.model.searchTerm) {
                matchesFilter = _.includes(historyItem.url, ctrl.model.searchTerm);
            }

            return matchesFilter;
        };

        ctrl.clearHistory = function () {
            historyService.clearHistory();
            ctrl.historyItems = [];
        };

        ctrl.showMore = function() {
            ctrl.model.limit += 50;
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
