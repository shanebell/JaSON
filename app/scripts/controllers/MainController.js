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

				$scope.model = buildDefaultModel();
			}

			function buildDefaultModel() {
				return {
					url: '',
					httpMethod: _.first($scope.httpMethods),
					contentType: _.first($scope.contentTypes).value,
					headers: [],
					requestBody: ''
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

					$log.debug('Send request: %s', angular.toJson($scope.model));

					var httpConfig = {
						method: $scope.model.httpMethod,
						url: $scope.model.url,
						headers: angular.extend([ { name: 'Content-Type', value: $scope.model.contentType } ], $scope.model.headers)
					};

					if ($scope.requestBodyAllowed()) {
						httpConfig.data = $scope.model.requestBody;
					}

					$http(httpConfig)
						.success(function(data, status, headers, config) {
							// TODO populate the model with the response data
							$log.debug('data: %s', angular.toJson(data));
							$log.debug('status: %s', status);
							$log.debug('headers: %s', angular.toJson(headers));
							$log.debug('config: %s', angular.toJson(config));
						})
						.error(function(data, status, headers, config) {
							// TODO populate the model with the error data
							$log.error('HTTP error: %s', status);
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
