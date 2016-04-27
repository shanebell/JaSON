angular.module('JaSON')
	.factory('httpService',
	[ '$http', '$log',
		function($http, $log) {

			return {

				send: function(data) {

					var httpConfig = {
						method: data.method,
						url: data.url,
						headers: data.headers
					};

					if (data.data)

					$http({
						method: data.method,
						url: data.url,
						headers: data.headers

					})
				}
			};

		}]);
