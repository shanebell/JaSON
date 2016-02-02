angular.module('JaSON')
	.factory('HistoryService',
	['$log', '$q',
		function ($log, $q) {

			$log.debug('Initialising HistoryService');

			var db = new PouchDB('JaSON');

			var historyItem = [
				{
					url: 'http://www.google.com/api/v1/users/quickbrownfox',
					method: 'POST',
					contentType: 'application/json',
					requestHeaders: [
						{name: 'Authorization', value: 'Basic MDQwNDAwNTcyNTowOTI0MmQzZS1kY2ZiLTRlNjUtYjlhNS0xM2E4OTE2YmExY2Q='}
					],
					requestBody: '{ name: \'value\' }',
					time: 204,
					responseCode: 200,
					responseBody: '{ name: \'value\' }',
					responseHeaders: [
						{name: 'Server', value: 'Apache-Coyote/1.1'},
						{name: 'Transfer-Encoding', value: 'chunked'},
						{name: 'Content-Type', value: 'application/json;charset=UTF-8'}
					]
				},
				{
					url: 'http://www.google.com/quick/brown/fox',
					method: 'PUT',
					contentType: 'application/json',
					requestHeaders: [
						{name: 'Authorization', value: 'Basic MDQwNDAwNTcyNTowOTI0MmQzZS1kY2ZiLTRlNjUtYjlhNS0xM2E4OTE2YmExY2Q='}
					],
					requestBody: '{ name: \'value\' }',
					time: 512,
					responseCode: 200,
					responseBody: '{ name: \'value\' }',
					responseHeaders: [
						{name: 'Server', value: 'Apache-Coyote/1.1'},
						{name: 'Transfer-Encoding', value: 'chunked'},
						{name: 'Content-Type', value: 'application/json;charset=UTF-8'}
					]
				},
				{
					url: 'http://www.google.com/api/v1/do-stuff',
					method: 'DELETE',
					contentType: 'application/json',
					requestHeaders: [
						{name: 'Authorization', value: 'Basic MDQwNDAwNTcyNTowOTI0MmQzZS1kY2ZiLTRlNjUtYjlhNS0xM2E4OTE2YmExY2Q='}
					],
					time: 204,
					responseCode: 200,
					responseBody: '{ name: \'value\' }',
					responseHeaders: [
						{name: 'Server', value: 'Apache-Coyote/1.1'},
						{name: 'Transfer-Encoding', value: 'chunked'},
						{name: 'Content-Type', value: 'application/json;charset=UTF-8'}
					]
				}
			];

			_.forEach(historyItem, function(historyItem) {
				db.post(historyItem, function(error) {
					if (error) {
						$log.error('Error saving history item: %s', angular.toJson(error));
					} else {
						$log.debug('Saved history item');
					}
				});
			});

            // PUBLIC API
			return {

                /**
                 * Save a new history item.
                 *
                 * @param historyItem the item to save.
                 */
				save: function(historyItem) {
					$log.debug('Saving item to history: %s', angular.toJson(historyItem));

                    // assign a date based id so that db.allDocs() will return docs in correct order
                    historyItem._id = new Date().toISOString();

                    db.put(historyItem, function(error) {
                        if (error) {
                            $log.debug('Error saving item to history: %s', angular.toJson(error));
                        } else {
                            $log.debug('History item saved successfully');
                        }
                    });
				},

                /**
                 * Get an array of the history items.
                 *
                 * @param limit an optional limit of how many items to return (defaults to 5000).
                 */
				getHistory: function(limit) {
					var promise = db.allDocs({
						include_docs: true,
						attachments: true,
                        limit: limit || 5000
					}).then(function(result) {
						return result.rows;
					});

                    // return a wrapped promise
                    return $q.when(promise);
				},

                /**
                 * Clear all items from the history.
                 */
				clearHistory: function() {
                    var promise = db.allDocs()
                        .then(function (response) {

                            // TODO use bulkDocs() to delete

                            // delete each history item
                            _.each(response.rows, function (doc) {
                                db.remove(doc.id, doc.value.rev);
                            });
                        });

                    // return a wrapped promise
                    return $q.when(promise);
				}
			};

		}]);
