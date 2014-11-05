'use strict';

angular.module('JaSON')
	.controller('AboutModalController',
	[ '$scope', '$log',
		function ($scope, $log) {

			function init() {
				$log.debug('Initialising AboutModalController...');
				bindFunctions();
			}

			function bindFunctions() {
			}

			init();

		}]);
