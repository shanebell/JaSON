'use strict';

angular.module('JaSON')
	.controller('historyController',
	[ '$scope', '$log', 'historyService',
		function ($scope, $log, historyService) {

			var ctrl = this;

			ctrl.model = {
			};

			historyService.getHistory(1000).then(
				function(historyItems) {
					ctrl.model.history = _.map(historyItems, function(historyItem) {
						return historyItem.doc;
					});
				},
				function(response) {
					$log.debug('Error: %s', angular.toJson(response));
				}
			);

			ctrl.clearHistory = function() {
				historyService.clearHistory();
				ctrl.model.history = [];
			};

		}]);
