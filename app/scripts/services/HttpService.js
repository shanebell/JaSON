angular.module('JaSON')
	.factory('HttpService',
	[ '$http', '$log',
		function($http, $log) {

			$log.debug('Initialising HttpService...');

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
