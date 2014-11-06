'use strict';

angular.module('JaSON')
	.controller('MainController',
	[ '$scope', '$log',
		function ($scope, $log) {

			function init() {
				$log.debug('Initialising MainController...');

				bindVars();
				bindFunctions();
			}

			function bindVars() {

				$scope.httpMethods = [
					'GET',
					'POST',
					'PUT',
					'DELETE',
					'HEAD'
				];

				$scope.contentTypes = [
					{
						name: 'JSON (application/json)',
						value: 'application/json'
					},
					{
						name: 'XML (text/xml)',
						value: 'text/xml'
					},
					{
						name: 'XML (application/xml)',
						value: 'application/xml'
					},
					{
						name: 'Form encoded',
						value: 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					{
						name: 'None',
						value: ''
					}
				];

				$scope.requestBodyPlaceholder = 'JSON or XML content. \'Form encoded\' requests can contain JSON content which will be converted to form request parameters and is available for all method types. \'JSON\' and \'XML\' requests pass the content through unmodified in the request body and hence is only available for POST and PUT methods. Note that JSON is strictly validated so element names and values must be "quoted".';

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

			function bindFunctions() {

				$scope.addHeader = function() {
					$scope.model.headers.push({ name: '', value: ''});
				};

				$scope.removeHeader = function(header) {
					$scope.model.headers = _.without($scope.model.headers, header);
				};

				$scope.sendRequest = function() {
					$log.debug('Send request: %s', angular.toJson($scope.model));
				};

				$scope.resetFields = function() {
					$scope.model = buildDefaultModel();
				};

				$scope.requestBodyAllowed = function() {
					return $scope.model.httpMethod == 'POST' || $scope.model.httpMethod == 'PUT';
				}
			}

			init();

		}]);
