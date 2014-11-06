'use strict';

angular.module('JaSON')
	.controller('NavigationController',
	[ '$scope', '$log', '$http', '$modal',
		function ($scope, $log, $http, $modal) {

			function init() {
				$log.debug('Initialising NavigationController...');

				bindFunctions();
			}

			function bindFunctions() {

				/**
				 * Show the 'About' modal.
				 */
				$scope.about = function () {
					$modal.open({
						templateUrl: '/templates/about-modal.html',
						windowClass: 'about-modal'
					});
				};
			}

			init();

		}]);
