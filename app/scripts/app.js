'use strict';

angular.module('JaSON', [
	'ui.bootstrap'
]);

angular.module('JaSON').constant('Data',
	{
		httpMethods: [
			'GET',
			'POST',
			'PUT',
			'DELETE',
			'HEAD'
		],

		contentTypes: [
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
		],

		requestBodyPlaceholder: 'JSON or XML content. \'Form encoded\' requests can contain JSON content which will be converted to form request parameters and is available for all method types. \'JSON\' and \'XML\' requests pass the content through unmodified in the request body and hence is only available for POST and PUT methods. Note that JSON is strictly validated so element names and values must be "quoted".'
	}
);
