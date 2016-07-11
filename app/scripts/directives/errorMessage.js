angular.module('JaSON')
    .directive('errorMessage', function() {
        return {
            restrict: 'E',
            scope: {
                show: '='
            },
            transclude: true,
            templateUrl: '/templates/error-message.html'
        };
    });