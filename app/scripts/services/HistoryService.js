angular.module('JaSON')
    .factory('historyService', function ($log, $q, localStorageService) {

        var LOCAL_STORAGE_KEY = 'history';

        var historyItems = [

            {
                url: 'http://localhost:8080/#/path/?a=123&b=456',
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
                ],
                date: new Date()
            },

            {
                url: 'https://www.thisisareallylongdomainnametoseewhathappens.com/api/v1/users/quickbrownfox?q=123',
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
                ],
                date: new Date()
            },

            {
                url: 'http://www.google.com/quick/brown/fox/#123',
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
                ],
                date: new Date()
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
                ],
                date: new Date()
            }

        ];

        var historyItem = {
            url: 'http://localhost:8080/#/path/?a=',
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
            ],
            date: new Date()
        };

        _.times(5000, function(i) {
            var clone = _.cloneDeep(historyItem);
            clone.url = clone.url + _.random(1, 10000);
            historyItems.push(clone);
        });

        localStorageService.set(LOCAL_STORAGE_KEY, historyItems);

        return {

            save: function (historyItem) {
                $log.debug('Saving history item');

                return $q(function(resolve) {
                    var historyItems = localStorageService.get(LOCAL_STORAGE_KEY) || [];
                    historyItems.push(historyItem);
                    localStorageService.set(LOCAL_STORAGE_KEY, historyItems);
                    resolve(historyItems);
                });
            },

            getHistory: function () {
                $log.debug('Getting history');

                return $q(function(resolve) {
                    resolve(localStorageService.get(LOCAL_STORAGE_KEY) || []);
                });
            },

            clearHistory: function () {
                $log.debug('Clearing history');
                localStorageService.set(LOCAL_STORAGE_KEY, []);
            }

        };

    });
