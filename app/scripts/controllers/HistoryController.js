'use strict';

angular.module('JaSON')
	.controller('HistoryController',
	[ '$scope', '$log', 'HistoryService',
		function ($scope, $log, HistoryService) {

			function init() {
				$log.debug('Initialising HistoryController...');

				bindVars();
				bindFunctions();
			}

			function bindVars() {

				// load the history
				HistoryService.getHistory(1000)
					.then(function(historyItems) {

						$scope.model.history = _.map(historyItems, function(historyItem) {
							return historyItem.doc;
						});

					});
			}

			function bindFunctions() {

				$scope.clearHistory = function() {
					$log.debug('Clearing history');
					HistoryService.clearHistory();
					$scope.model.history = [];
				};

			}

			init();

		}]);
