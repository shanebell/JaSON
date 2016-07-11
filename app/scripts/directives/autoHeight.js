angular.module('JaSON')
    .directive('autoHeight', function($log, $window) {

        return {
            restrict: 'A',
            link: function(scope, element) {

                // top padding: 60px
                // hr: 41px
                // bottom padding: 20px
                // tabs: 52px

                $log.debug('window: %s x %s', $window.innerWidth, $window.innerHeight);

                angular.element($window).bind('resize', function() {
                    $log.debug('window: %s x %s', $window.innerWidth, $window.innerHeight);
                });

                var topRow = angular.element('#top-row');
                $log.debug('topRow: %s x %s', topRow.width(), topRow.height());

                $log.debug('Setting height of element: %s', angular.toJson(element));

                var height = $window.innerHeight - 60 - 41 - 20 - 52 - topRow.height();
                $log.debug('Calculated height: %s', height);

                element.css('height', height + 'px');
                element.css('overflow', 'scroll');
            }
        };

    });