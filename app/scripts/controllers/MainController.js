'use strict';

angular.module('JaSON')
	.controller('MainController',
	[ '$scope', '$log','$http', 'HttpService', 'Data',
		function ($scope, $log, $http, HttpService, Data) {

			function init() {
				$log.debug('Initialising MainController...');

				bindVars();
				bindFunctions();
			}

			function bindVars() {

				$scope.httpMethods = Data.httpMethods;
				$scope.contentTypes = Data.contentTypes;
				$scope.requestBodyPlaceholder = Data.requestBodyPlaceholder;
				$scope.responseCodes = Data.responseCodes;

				$scope.loading = false;

				$scope.model = buildDefaultModel();
			}

			function buildDefaultModel() {
				return {
					url: 'http://localhost:3000/',
					httpMethod: _.first($scope.httpMethods),
					contentType: _.first($scope.contentTypes).value,
					headers: [],
					requestBody: '',
					response: {},
					history: [
						{ method: 'GET', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'DELETE', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'PUT', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'POST', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'POST', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'DELETE', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'POST', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'PUT', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'POST', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'DELETE', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'PUT', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'DELETE', url: 'http://www.google.com/api/x/y/z?abc=123', 'contentType': 'application/json' },
						{ method: 'POST', url: 'http://www.google.com', 'contentType': 'application/json' },
						{ method: 'PUT', url: 'http://www.google.com', 'contentType': 'application/json' },
						{ method: 'PUT', url: 'http://www.google.com', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com', 'contentType': 'application/json' },
						{ method: 'DELETE', url: 'http://www.google.com', 'contentType': 'application/json' },
						{ method: 'GET', url: 'http://www.google.com', 'contentType': 'application/json' },
					]
				};
			}

			function validate() {
				// TODO validate the state of the form
			}

			function bindFunctions() {

				$scope.addHeader = function() {
					$scope.model.headers.push({ name: '', value: ''});
				};

				$scope.removeHeader = function(header) {
					$scope.model.headers = _.without($scope.model.headers, header);
				};

				$scope.sendRequest = function() {

					var headers = {
						'Content-Type': $scope.model.contentType
					};
					_.each($scope.model.headers, function(header) {
						headers[header.name] = header.value;
					});

					var httpConfig = {
						method: $scope.model.httpMethod,
						url: $scope.model.url,
						headers: headers
					};

					if ($scope.requestBodyAllowed()) {
						httpConfig.data = $scope.model.requestBody;
					}

					$scope.loading = true;

					var startTime = new Date().getTime()
					$http(httpConfig)
						.success(function(data, status, headers) {
							var endTime = new Date().getTime();
							$scope.model.response = {
								data: data,
								status: status,
								headers: headers(),
								time: endTime - startTime
							};
							$scope.loading = false;
						})
						.error(function(data, status, headers) {
							var endTime = new Date().getTime();
							$scope.model.response = {
								data: data,
								status: status,
								headers: headers(),
								time: endTime - startTime
							};
							$scope.loading = false;
						});
				};

				/**
				 * Reset the form back to it's default state.
				 */
				$scope.resetFields = function() {
					$scope.model = buildDefaultModel();
				};

				/**
				 * Used to determine whether the user can provide a request body based on
				 * the current value of the HTTP method. eg: HTTP GET does not support a
				 * request body.
				 *
				 * @returns {boolean} true if a request body is allowed, false otherwise.
				 */
				$scope.requestBodyAllowed = function() {

					// TODO check if request content is allowed for other content types
					return $scope.model.httpMethod == 'POST' || $scope.model.httpMethod == 'PUT';
				}
			}

			init();

		}]);
