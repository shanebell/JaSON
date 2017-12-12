angular.module("JaSON")
    .directive("animateOn", function($rootScope, $animate) {

        return {
            restrict: "A",
            scope: {
                animateOn: "@"
            },
            link: function(scope, element) {
                var animateClass = "animate";
                $rootScope.$on(scope.animateOn, function() {
                    $animate.addClass(element, animateClass).then(
                        function() {
                            $animate.removeClass(element, animateClass);
                        }
                    );
                });
            }
        };

    });