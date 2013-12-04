$(document).ready(function() {
    JaSON.init();
});

var JaSON = {

    init: function() {

        JaSON.startTime = 0;
        JaSON.endTime = 0;

        // set focus on the URL field
        $("#url").focus();

        JaSON.loadSavedRequests(false);
        JaSON.registerEventHandlers();
    },

    /**
     * Register handlers for button clicks etc.
     */
    registerEventHandlers: function() {

        // load a saved request from the history
        $("#saved-requests").on("click", ".saved-request", JaSON.copySavedRequest);

        // add/remove headers
        $("#add-header-action").on("click", JaSON.addHeaderInput);
        $("#headers").on("click", ".delete-header-action", function() {
            $(this).parents(".header").remove();
        });

        // send a request
        $("#send").on("click", JaSON.sendRequest);

        // reset fields
        $("#reset").on("click", JaSON.resetAndClear);

        // clear history
        $("#clear-saved-requests-action").on("click", JaSON.clearSavedRequests);

        // manage tabs
        $("#response-tab, #response-headers-tab, #raw-response-tab").on("click", JaSON.manageTabs);

        // manage the editability and content of the request body
        $("#method, #content-type").on("change", JaSON.manageRequestBody);

        // handle a manual clear of the request body content
        $("#request-body").on("change", JaSON.handleRequestBodyClear);

        // hitting enter in the URL field will submit the form
        $("#url").keypress(function(event) {
            if (event.which == 13) {
                event.preventDefault();
                JaSON.sendRequest();
            }
        });
    },

	/**
	 * Reset field visibility, css classes etc back to the default state.
	 */
	reset: function() {

        $(".nav-tabs li").removeClass("active");
        $(".nav-tabs li:first").addClass("active");

        $("#response-code").hide();
		$("#response-code").html("");
		$("#response-code").removeClass("label-danger label-success");

        $("#response-time").hide();
        $("#response-time").html("");

        $("#response").hide();
		$("#response").html("");

        $("#raw-response").hide();
		$("#raw-response").html("");

        $("#response-headers").hide();
		$("#response-headers").html("");

        $(".help-block").hide();
		$(".form-group").removeClass("has-error");
	},
	
	/**
	 * Reset and clear all fields (except saved requests)
	 */
	resetAndClear: function() {
		JaSON.reset();
		$("#url").val("");
        $("#method").val("GET");
        $("#content-type").val("application/json");
        $("#request-body").val("");
        $("#request-body").data("value", "");

		$("#headers .header").remove();
	},
	
	/**
	 * Clear the saved request history.
	 */
	clearSavedRequests: function() {
		$("#saved-requests").empty();
		$("#saved-requests-row").hide();
		localStorage.clear();
	},
	
	/**
	 * Copy a saved request from the history into the request fields.
	 */
	copySavedRequest: function(event) {
		var key = $(this).attr("id");
		var value = JSON.parse(localStorage[key]);

        JaSON.reset();

		$(this).effect("transfer", { to: $(".main") }, 300, function() {
			$("#url").val(value.url);
			$("#method").val(value.method);
			$("#content-type").val(value.contentType);
			$("#request-body").val(value.requestBody);
			$("#headers .header").remove();
			$(value.headers).each(function() {
				JaSON.addHeaderInput(this[0], this[1]);
			});
            $("#raw-response").text(value.response);
            $("#response-code").html(value.responseCode);
            $("#response-code").addClass(value.responseCodeClass);
            $("#response-time").html(value.responseTime);
            $("#response-headers").html(value.responseHeaders);

            JaSON.processResponseData(value.contentType, value.response);

			$("#url, #method, #content-type, #request-body, #headers .name, #headers .value, #response-code, #response-time, #response").effect("highlight", {}, 1000);

            if ($("#response").html() == "") {
                $("#response").hide();
            }

			JaSON.manageRequestBody();
		});
	},
	
	/**
	 * Validate inputs and show error messages.
	 */
	validate: function() {
		
		var valid = true;
		
		// validate URL
		var url = $("#url").val().trim();
		if (url == "") {
			valid = false;
            $("#url").focus();
            $("#url-group").addClass("has-error");
			$("#url-error").show();
		}
		
		// validate request headers
		var headers = [];
		$(".header").each(function() {
			var name = $(".name", this).val().trim().toLowerCase();
	        var value = $(".value", this).val().trim();

            var error = "";
	        if (name == "" || value == "") {
	        	valid = false;
                error = "Header name and value are required";
	        } else if (headers.indexOf(name) >= 0) {
	        	valid = false;
                error = "A header with this name already exists";
	        } else {
				headers.push(name);
	        }

            if (!valid) {
                $(".help-block", this).html(error);
	        	$(".form-group", this).addClass("has-error");
	        	$(".help-block", this).show();
            }
	    });
		
		// validate request body
		var requestBody = $("#request-body").val().trim();
		var contentType = $("#content-type").val();
		if (requestBody != "") {
			if (contentType == "application/json" || contentType == "application/x-www-form-urlencoded; charset=UTF-8") {
				try {
					$.parseJSON(requestBody);
				} catch (exception) {
					valid = false;
					$("#request-body-error").html("Invalid JSON: " + exception.message);
					$("#request-body-group").addClass("has-error");
					$("#request-body-error").show();
				}		
			} else if (contentType == "text/xml" || contentType == "application/xml") {
				try {
					$.parseXML(requestBody);
				} catch (exception) {
					valid = false;
					$("#request-body-error").html(exception.message);
					$("#request-body-group").addClass("has-error");
					$("#request-body-error").show();
				}
			}
		}
		
		return valid;
	},
	
	/**
	 * Manage the display of the result tabs.
	 */
	manageTabs: function() {
		$("#response-tab, #response-headers-tab, #raw-response-tab").removeClass("active");
		$(this).addClass("active");
		
		var response = $("#response");
		var responseHeaders = $("#response-headers");
		var rawResponse = $("#raw-response");

		switch($(this).attr("id")) {
		
		case "response-tab":
			responseHeaders.hide();
		    rawResponse.hide();
			if (response.html() != "") {
				response.show();
			}
			break;
		case "response-headers-tab":
			response.hide();
			rawResponse.hide();
			if (responseHeaders.html() != "") {
				responseHeaders.show();
			}
			break;
		case "raw-response-tab":
			response.hide();
			responseHeaders.hide();
			if (rawResponse.html() != "") {
				rawResponse.show();
			}
			break;
		}
	},
	
	/**
	 * Manage the display and value of the request body depending on the request method and content type
	 */
	manageRequestBody: function() {

		var requestBody = $("#request-body");

		// save the current value of the request body field
		if (requestBody.val()) {
			requestBody.data("value", requestBody.val());
		}

		// disable the field and populate as appropriate
		var method = $("#method").val();
        var contentType = $("#content-type").val();
		if (method == "POST" || method == "PUT" || contentType == "application/x-www-form-urlencoded; charset=UTF-8") {
			requestBody.val(requestBody.data("value"));
			requestBody.prop("disabled", false);
		} else {
			requestBody.val("");
			requestBody.prop("disabled", true);
		}
	},

    /**
     * If a user manually clears the content of the request body field then clear the field's data value.
     * This prevents the field from being re-populated with the old value if they change the method or
     * content type drop downs.
     */
    handleRequestBodyClear: function() {
        if ($("#request-body").val().trim() == "") {
            $("#request-body").data("value", "");
        }
    },
	
	/**
	 * Construct a request and send it.
	 */
	sendRequest: function() {

		JaSON.reset();
		
		if (!JaSON.validate()) {
			return false;	
		}
		
		$("#loading").show();

        var contentType = $("#content-type").val();

        // defaults
        var ajaxArgs = {
			url: JaSON.getURL("#url"),
	        type: $("#method").val(),
	    	contentType: contentType,
	        processData: false,
			beforeSend: JaSON.processHeaders,
	        data: $("#request-body").val().trim(),
			success: JaSON.successResponse,
			error: JaSON.errorResponse
		};

	    // form encoded requests must process the data before sending
	    if (contentType == "application/x-www-form-urlencoded; charset=UTF-8" && ajaxArgs.data != "") {
            ajaxArgs.processData = true;
            ajaxArgs.data = JSON.parse(ajaxArgs.data);
	    }

        JaSON.startTime = new Date().getTime();
		$.ajax(ajaxArgs);
	},

	/**
	 * Save the request to the local browser storage
	 */
	saveRequest: function() {
		
		// build an array of the request headers
		var headers = [];
		$(".header").each(function() {
			var name = $(".name", this).val().trim();
	        var value = $(".value", this).val().trim();
	        headers.push([ name, value ]);
	    });
		
        var key = moment().format();
		var value = JSON.stringify({
			"url" : $("#url").val(),
			"method" : $("#method").val(),
			"contentType" : $("#content-type").val(),
			"headers" : headers,
			"requestBody" : $("#request-body").val(),
            "responseCode" : $("#response-code").text(),
            "responseCodeClass" : $("#response-code").attr('class'),
            "response" : $("#raw-response").text(),
            "responseTime" : $("#response-time").text(),
            "responseHeaders" : $("#response-headers").text()
		});

		localStorage[key] = value;
		
		JaSON.loadSavedRequests(true);
	},
	
	/**
	 * Load saved requests into the saved requests table.
	 * 
	 * The refresh flag indicates whether the table is being
	 * updated after saving a request in which case the first
	 * row is highlighted after the requests are loaded.
	 */
	loadSavedRequests: function(refresh) {
		
		$("#saved-requests").empty();
		
		var keys = [];
		for (var key in localStorage) {
			keys.push(key);
		}
		keys.sort().reverse();
		
		for (var i=0; i<keys.length; i++) {
			var key = keys[i];
			
			// load the first 250, delete the rest
			if (i < 250) {
				var value = JSON.parse(localStorage[key]);
				
				// remove leading http(s) from URL and trim to a max of 40 chars
				var url = value.url.replace(/http(s)?:\/\//, "");

				// add a row to the table

                $("#saved-requests").append(Handlebars.templates.savedRequest({
                    "id": key,
                    "shortUrl": url,
                    "longUrl": value.url,
                    "date": moment(key).format("YYYY/MM/DD HH:mm:ss"),
                    "method": value.method
                }));
			} else {
				localStorage.removeItem(key);
			}
		}
		
		if ($(".saved-request").size() > 0) {
			$("#saved-requests-row").show();
			if (refresh) {
				$(".saved-request:first").effect("highlight", {}, 1000)
			}
		}
		
		// enable tooltips
		$(".saved-request").tooltip({
            placement: "bottom",
            container: "body",
            html: true,
            delay: { show: 500, hide: 100 }
        });
	},
	
	/**
	 * Get a URL string from the given selector and clean it up
	 * by trimming and prefixing with http if necessary.
	 */
	getURL: function(selector) {
	    var url = $(selector).val().trim();
	    return url.indexOf("http") != 0 ? "http://" + url : url;
	},
	
	/**
	 * Add headers to the request. 
	 */
	processHeaders: function(jqXHR) {
	    $(".header").each(function() {
			var name = $(".name", this).val().trim();
	        var value = $(".value", this).val().trim();

	        if (name == "" || value == "") {
	        	$(this).remove();
	        } else {
		        jqXHR.setRequestHeader(name, value);
	        }
	    });
	},
	
	/**
	 * Called when the AJAX response returns success.
	 */
	successResponse: function(data, textStatus, jqXHR) {
        JaSON.processResponse(jqXHR, true);
        JaSON.saveRequest();
	},
	
	/**
	 * Called when the AJAX response returns an error.
	 */
	errorResponse: function(jqXHR, textStatus, errorThrown) {
		JaSON.processResponse(jqXHR, false);
	},
	
	/**
	 * Process a response. A successful (ie: non error) response is indicated by setting 'success' to true.
	 */
	processResponse: function(jqXHR, success) {

        JaSON.endTime = new Date().getTime();

		// response code and headers
		$("#response-code").addClass(success ? "label-success" : "label-danger");
		$("#response-code").html(jqXHR.status + ": " + jqXHR.statusText);
        $("#response-time").html((JaSON.endTime - JaSON.startTime) + "ms");
		$("#response-headers").html(jqXHR.getAllResponseHeaders());

		// parse the response body if there is one
		var data = jqXHR.responseText;
		var contentType = jqXHR.getResponseHeader("Content-Type");
		
		$("#raw-response").text(data);

        JaSON.processResponseData(contentType, data);

		// show the response
		$("#loading").hide();
		$("#response-code").show();
        $("#response-time").show();
		if ($("#response").html() != "") {
			$("#response").show();
		}
	},

    /**
     * Process the response data and optionally format it for readability.
     */
    processResponseData: function(contentType, data) {

        if (JaSON.isJson(contentType)) {
            try {
                $("#response").text(JSON.stringify(JSON.parse(data), null, 2));
            } catch (exception) {
                // JSON must be invalid, just show it unparsed
                $("#response").text(data);
            }
        } else {

            // TODO: format XML for readability
            $("#response").text(data);
        }

        // only syntax highlight if the response data is small
        if (data.length < 10000) {
            $("#response, #response-headers").removeClass("prettyprinted");
            prettyPrint();
        }
    },
	
	/**
	 * Returns true if the content type is a valid JSON content type.
	 */
	isJson: function(contentType) {
		var jsonContentTypes = [ 
		    "application/json",
		    "application/x-javascript",
            "application/javascript",
		    "text/javascript",
		    "text/x-javascript",
		    "text/x-json"
		];
		return contentType != null && jsonContentTypes.some(function(element) {
			return contentType.indexOf(element) == 0;
		});
	},
	
	/**
	 * Returns true if the content type is a valid XML content type.
	 */
	isXml: function(contentType) {
		var xmlContentTypes = [
		    "text/xml",
		    "application/xml",
		    "text/xml-external-parsed-entity", 
		    "application/xml-external-parsed-entity", 
		    "application/xml-dtd"
		];
		return contentType != null && xmlContentTypes.some(function(element) {
			return contentType.indexOf(element) == 0;
		});
	},
	
	/**
	 * Add a request header input field (name and value) to the page
	 */
	addHeaderInput: function(name, value) {
        $("#headers").append(Handlebars.templates.requestHeader({
            "name": typeof name == "string" ? name : "",
            "value": typeof value == "string" ? value : ""
        }));
        $("#headers .name:last").focus();
	}
};


/**
 * Google analytics
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-30163240-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

