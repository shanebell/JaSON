'use strict';

angular.module('JaSON')
	.factory('HistoryService',
	['$log',
		function ($log) {

			// PRIVATE FUNCTIONS

			return {

				// PUBLIC API
				save: function() {
					$log.debug('Saving to history');
				}
			};

		}]);
