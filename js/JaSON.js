$(document).ready(function() {
	
	// default focus on the URL field
	$("#url").focus();
	
	// load any previously saved requests
	JaSON.loadSavedRequests(false);

    // load a saved request from the history
	$(document).on("click", ".savedRequest", JaSON.copySavedRequest);

    // add a header
	$("#addHeader").click(JaSON.addHeaderInput);

    // send a request
	$("#send").click(JaSON.sendRequest);

    // reset fields
	$("#reset").click(JaSON.resetAndClear);

    // clear history
	$("#clearSavedRequests").click(JaSON.clearSavedRequests);

    // delete a header
	$(document).on("click", ".deleteHeader", function() {
		$(this).parents(".header").remove();
	});

    // manage tabs
	$("#responseTab, #responseHeadersTab, #rawResponseTab").click(JaSON.manageTabs);

    // manage the editability and content of the request body
	$("#method").on("change", JaSON.manageRequestBody);
	$("#contentType").on("change", JaSON.manageRequestBody);

    // handle a manual clear of the request body content
    $("#requestBody").change(JaSON.handleRequestBodyClear);

});

var JaSON = {
	
	/**
	 * Reset field visibility, css classes etc back to the default state.
	 */
	reset: function() {
		
		$("#responseHeadersTab").removeClass("active");
		$("#rawResponseTab").removeClass("active");
		$("#responseTab").addClass("active");

        $("#responseCode").hide();
		$("#responseCode").html("");
		$("#responseCode").removeClass("label-important");
		$("#responseCode").removeClass("label-success");

        $("#response").hide();
		$("#response").html("");

        $("#rawResponse").hide();
		$("#rawResponse").html("");


        $("#responseHeaders").hide();
		$("#responseHeaders").html("");

        $(".help-inline").hide();
		$(".help-inline").html("");
		
		$(".control-group").removeClass("error");
	},
	
	/**
	 * Reset and clear all fields (except saved requests)
	 */
	resetAndClear: function() {
		JaSON.reset();
		$("#url").val("");
		$("#method").val("GET");
		$("#contentType").val("JSON");
        $("#requestBody").val("");
        $("#requestBody").data("value", "");
		$("#requestHeaders .header").remove();
	},
	
	/**
	 * Clear the saved request history.
	 */
	clearSavedRequests: function() {
		$("#savedRequests").empty();
		$("#savedRequestsRow").hide();
		localStorage.clear();
	},
	
	/**
	 * Copy a saved request from the history into the request fields.
	 */
	copySavedRequest: function(event) {
		var key = $(this).attr("id");
		var value = JSON.parse(localStorage[key]);
		
		$(this).effect("transfer", { to: $("#leftPanel") }, 300, function() {
			$("#url").val(value.url);
			$("#method").val(value.method);
			$("#contentType").val(value.contentType);
			$("#requestBody").val(value.requestBody);
			$("#requestHeaders .header").remove();
			$(value.headers).each(function() {
				JaSON.addHeaderInput(this[0], this[1]);
			});
			
			$("#url").effect("highlight", {}, 1000)
			$("#method").effect("highlight", {}, 1000)
			$("#contentType").effect("highlight", {}, 1000)
			$("#requestBody").effect("highlight", {}, 1000)
			$("#requestHeaders .name").effect("highlight", {}, 1000)
			$("#requestHeaders .value").effect("highlight", {}, 1000)
			
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
			$("#urlError").html("URL is required");
			$("#urlGroup").addClass("error");
			$("#urlError").show();
			$("#url").focus();
		}
		
		// validate request headers
		var headers = [];
		$(".header").each(function() {
			var name = $(".name", this).val().trim().toLowerCase();
	        var value = $(".value", this).val().trim();
	        
	        if (name == "" || value == "") {
	        	valid = false;
	        	$(".help-inline", this).html("Header name and value are required");
	        	$(".control-group", this).addClass("error");
	        	$(".help-inline", this).show();
	        } else if (headers.indexOf(name) >= 0) {
	        	valid = false;
	        	$(".help-inline", this).html("A header with this name already exists");
	        	$(".control-group", this).addClass("error");
	        	$(".help-inline", this).show();
	        } else {
				headers.push(name);
	        }
	    });
		
		// validate request body
		var requestBody = $("#requestBody").val().trim();
		var contentType = $("#contentType").val();
		if (requestBody != "") {
			if (contentType == "application/json" || contentType == "application/x-www-form-urlencoded; charset=UTF-8") {
				try {
					$.parseJSON(requestBody);
				} catch (exception) {
					valid = false;
					$("#requestBodyError").html("Invalid JSON: " + exception.message);
					$("#requestBodyGroup").addClass("error");
					$("#requestBodyError").show();
				}		
			} else if (contentType == "text/xml") {
				try {
					$.parseXML(requestBody);
				} catch (exception) {
					valid = false;
					$("#requestBodyError").html(exception.message);
					$("#requestBodyGroup").addClass("error");
					$("#requestBodyError").show();
				}
			}
		}
		
		return valid;
	},
	
	/**
	 * Manage the display of the result tabs.
	 */
	manageTabs: function() {
		$("#responseTab, #responseHeadersTab, #rawResponseTab").removeClass("active");
		$(this).addClass("active");
		
		var response = $("#response");
		var responseHeaders = $("#responseHeaders");
		var rawResponse = $("#rawResponse");

		switch($(this).attr("id")) {
		
		case "responseTab":
			responseHeaders.hide();
		    rawResponse.hide();
			if (response.html() != "") {
				response.show();
			}
			break;
		case "responseHeadersTab":
			response.hide();
			rawResponse.hide();
			if (responseHeaders.html() != "") {
				responseHeaders.show();
			}
			break;
		case "rawResponseTab":
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

		var requestBody = $("#requestBody");

		// save the current value of the request body field
		if (requestBody.val()) {
			requestBody.data("value", requestBody.val());
		}

		// disable the field and populate as appropriate
		var method = $("#method").val();
        var contentType = $("#contentType").val();
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
        if ($("#requestBody").val().trim() == "") {
            $("#requestBody").data("value", "");
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

        var contentType = $("#contentType").val();

        // defaults
        var ajaxArgs = {
			url: JaSON.getURL("#url"),
	        type: $("#method").val(),
	    	contentType: contentType,
	        processData: false,
			beforeSend: JaSON.processHeaders,
	        data: $("#requestBody").val().trim(),
			success: JaSON.successResponse,
			error: JaSON.errorResponse
		};

	    // form encoded requests must process the data before sending
	    if (contentType == "application/x-www-form-urlencoded; charset=UTF-8" && ajaxArgs.data != "") {
            ajaxArgs.processData = true;
            ajaxArgs.data = JSON.parse(ajaxArgs.data);
	    }

	    trackRequest(ajaxArgs.url);
	    
		$.ajax(ajaxArgs);
	},

	/**
	 * Save the request to the local broswer storage
	 */
	saveRequest: function() {
		
		// build an array of the request headers
		var headers = [];
		$(".header").each(function() {
			var name = $(".name", this).val().trim();
	        var value = $(".value", this).val().trim();
	        headers.push([ name, value ]);
	    });
		
		var key = $.format.date(new Date(), "dd/MM/yyyy HH:mm:ss");
		var value = JSON.stringify({
			"url" : $("#url").val(),
			"method" : $("#method").val(),
			"contentType" : $("#contentType").val(),
			"headers" : headers,
			"requestBody" : $("#requestBody").val()
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
		
		$("#savedRequests").empty();
		
		var keys = [];
		for (var key in localStorage) {
			keys.push(key);
		}
		keys.sort().reverse();
		
		for (var i=0; i<keys.length; i++) {
			var key = keys[i];
			
			// load the first 50, delete the rest
			if (i < 50) {
				var value = JSON.parse(localStorage[key]);
				
				// remove leading http(s) from URL and trim to a max of 40 chars
				var url = value.url.replace(/http(s)?:\/\//, "");
				if (url.length > 35) {
					url = url.substring(0, 35) + "...";
				}

				// add a row to the table
				var row = $("<tr/>").addClass("savedRequest").attr("id", key);
				row.append($("<td/>").html(i + 1 + "."));
				row.append($("<td/>").html(key));
				row.append($("<td/>").html(url));
				row.append($("<td/>").html($("<span/>").addClass("label").html(value.method)));
				
				// add a tooltip if the URL had to be trimmed
				if (url.indexOf("...") > 0) {
					row.attr("title", value.url);
				}
				
				$("#savedRequests").append(row);
			} else {
				localStorage.removeItem(key);
			}
		}
		
		if ($(".savedRequest").size() > 0) {
			$("#savedRequestsRow").show();
			if (refresh) {
				$(".savedRequest:first").effect("highlight", {}, 1000)
			}
		}
		
		// enable tooltips
		$(".savedRequest").tooltip({ "placement": "bottom" });
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
		JaSON.saveRequest();
		JaSON.processResponse(jqXHR, true);
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
		
		// response code and headers
		$("#responseCode").addClass(success ? "label-success" : "label-important");
		$("#responseCode").html(jqXHR.status + ": " + jqXHR.statusText);
		$("#responseHeaders").html(jqXHR.getAllResponseHeaders());

		// parse the response body if there is one
		var data = jqXHR.responseText;
		var contentType = jqXHR.getResponseHeader("Content-Type");
		
		$("#rawResponse").text(data);
		
		if (JaSON.isJson(contentType)) {
			try {
		    	$("#response").text(JSON.stringify(JSON.parse(data), null, 2));
			} catch (exception) {
				
				// JSON must be invalid, just show it unparsed
		    	$("#response").text(data);
			}
		} else if (JaSON.isXml(contentType)) {
			$("#response").text(data);
		}
		
		// pretty print the response and response headers
		prettyPrint();
		
		// show the response
		$("#loading").hide();
		$("#responseCode").show();
		if ($("#response").html() != "") {
			$("#response").show();
		}
	},
	
	/**
	 * Returns true if the content type is a valid JSON content type.
	 */
	isJson: function(contentType) {
		var jsonContentTypes = [ 
		    "application/json",
		    "application/x-javascript",
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
		
		// cleanse inputs
		name = typeof name == "string" ? name : ""; 
		value = typeof value == "string" ? value : "";
		
		var header = $(".headerPrototype").clone();
		header.removeClass("headerPrototype");
		header.addClass("header");
		$(header).find(".name").val(name);
		$(header).find(".value").val(value);
		$("#requestHeaders").append(header);
		header.show();
		$(header).find(".name").focus();
	}
};


/**
 * Google analytics
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-30163240-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function trackRequest(url) {
	_gaq.push(['_trackEvent', 'URL Request', url]);
}