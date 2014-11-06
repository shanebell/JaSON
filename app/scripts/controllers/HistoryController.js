'use strict';

angular.module('JaSON')
	.controller('HistoryController',
	[ '$scope', '$log',
		function ($scope, $log) {

			function init() {
				$log.debug('Initialising HistoryController...');

				bindFunctions();
			}

			function bindFunctions() {

			}

			init();

		}]);
