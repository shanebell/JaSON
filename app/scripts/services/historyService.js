angular.module('JaSON')
    .factory('historyService', function ($q, localStorageService) {

        var LOCAL_STORAGE_KEY = 'history';
        var MAX_SIZE = 2500;

        return {

            save: function (historyItem) {
                return $q(function(resolve) {
                    var historyItems = localStorageService.get(LOCAL_STORAGE_KEY) || [];

                    // add the new history item to the front of the array
                    historyItems.unshift(historyItem);

                    // if we've hit the history limit then splice the extras from the end
                    if (historyItems.length > MAX_SIZE) {
                        historyItems.splice(MAX_SIZE);
                    }

                    localStorageService.set(LOCAL_STORAGE_KEY, historyItems);
                    resolve(historyItems);
                });
            },

            getHistory: function () {
                return $q(function(resolve) {
                    resolve(localStorageService.get(LOCAL_STORAGE_KEY) || []);
                });
            },

            clearHistory: function () {
                localStorageService.set(LOCAL_STORAGE_KEY, []);
            }

        };

    });
