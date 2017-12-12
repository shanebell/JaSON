angular.module("JaSON")
    .controller("navController", function ($scope, $log, $uibModal, referenceData) {

        var ctrl = this;

        ctrl.about = function () {
            $uibModal.open({
                templateUrl: "/templates/about-modal.html",
                windowClass: "about-modal",
                animation: true,
                controller: function($scope, version) {
                    $scope.version = version;
                },
                resolve: {
                    version: function() {
                        return referenceData.version;
                    }
                }
            });
        };

    });
