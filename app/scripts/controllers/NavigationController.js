'use strict';

angular.module('JaSON')
	.controller('NavigationController',
	[ '$scope', '$log', '$http', '$modal',
		function ($scope, $log, $http, $modal) {

			function init() {
				$log.debug('Initialising NavigationController...');

				bingFunctions();
			}

			function bingFunctions() {

				$scope.about = function() {
					$modal.open({
						templateUrl: '/templates/about-modal.html',
						size: 'sm',
						controller: 'AboutModalController',
						windowClass: 'app-modal-window'
					});

				};

			}

			init();

		}]);
