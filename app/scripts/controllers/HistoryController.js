'use strict';

angular.module('JaSON')
	.controller('HistoryController',
	[ '$scope', '$log',
		function ($scope, $log) {

			function init() {
				$log.debug('Initialising HistoryController...');

				bindVars();
				bindFunctions();
			}

			function bindVars() {
				$scope.model = {
					history: []
				};
			}

			function bindFunctions() {

				$scope.clearHistory = function() {
					$log.debug('Clearing history');
					$scope.model.history = [];
				};

			}

			init();

		}]);
