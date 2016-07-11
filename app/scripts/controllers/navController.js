angular.module('JaSON')
    .controller('navController', function ($scope, $log, $uibModal) {

        var ctrl = this;

        ctrl.about = function () {
            $uibModal.open({
                templateUrl: '/templates/about-modal.html',
                windowClass: 'about-modal',
                animation: true
            });
        };

    });
