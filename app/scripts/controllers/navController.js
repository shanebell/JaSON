angular.module('JaSON')
	.controller('navController',
	[ '$scope', '$log', '$uibModal',
		function ($scope, $log, $uibModal) {

			var ctrl = this;

			ctrl.about = function () {
				$uibModal.open({
					templateUrl: '/templates/about-modal.html',
					windowClass: 'about-modal'
				});
			};

		}]);
