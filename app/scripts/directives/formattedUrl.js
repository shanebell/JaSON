angular.module('JaSON')
    .directive('formattedUrl', function() {

        return {
            restrict: 'E',
            scope: {
                url: '='
            },
            templateUrl: '/templates/formatted-url.html',
            link: function(scope) {
                scope.URL = new URL(scope.url);
            }
        };

    });