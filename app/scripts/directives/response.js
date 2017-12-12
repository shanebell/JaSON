angular.module("JaSON")
    .directive("response", function() {

        var imageTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png"
        ];

        return {
            restrict: "E",
            require: "ngModel",
            scope: {
            },
            templateUrl: "/templates/response.html",
            link: function(scope, element, attrs, ngModel) {
                ngModel.$render = function() {

                    scope.response = ngModel.$viewValue;
                    var contentType = _.get(_.find(scope.response.headers, { name: "content-type" }), "value");

                    // TODO render images inline in the template
                    scope.isImage = _.includes(imageTypes, contentType);
                    scope.isData = !scope.isImage;
                }

            }
        };

    });