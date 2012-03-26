$(document).ready(function() {
	
	var version = "v1.0";
	
	$(".version").html(version);
	
	// default focus on the URL field
	$("#url").focus();
	
	$("#addHeader").click(addHeaderInput);

	$("#send").click(sendRequest);
	
	$(document).on("click", ".deleteHeader", function() {
		$(this).parents(".header").remove();
	});
	
	$("#responseTab, #responseHeadersTab").click(manageTabs);
	
	$("#aboutModal").modal({
		show: false
	});
	
});

/**
 * Reset field visibility, css classes etc back to the default state.
 */
function reset() {
	
	$("#responseHeadersTab").removeClass("active");
	$("#responseTab").addClass("active");
	
	$("#responseCode").hide();
	$("#responseCode").html("");
	$("#responseCode").removeClass("label-important");
	$("#responseCode").removeClass("label-success");
	
	$("#response").hide();
	$("#response").html("");
	$("#responseHeaders").hide();
	$("#responseHeaders").html("");
	
	$(".help-inline").hide();
	$(".help-inline").html("");
	
	$(".control-group").removeClass("error");
}

/**
 * Validate inputs and show error messages.
 */
function validate() {
	
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
	if (requestBody != "") {
		try {
			JSON.parse(requestBody);
		} catch (exception) {
			valid = false;
			$("#requestBodyError").html("Invalid JSON: " + exception.message);
			$("#requestBodyGroup").addClass("error");
			$("#requestBodyError").show();
		}		
	}
	
	return valid;
}

/**
 * Manage the display of the result tabs.
 */
function manageTabs() {
	
	$("#responseTab, #responseHeadersTab").removeClass("active");
	$(this).addClass("active");
	
	var response = $("#response");
	if (response.html() != "") {
		response.toggle();
	}
	
	var responseHeaders = $("#responseHeaders");
	if (responseHeaders.html() != "") {
		responseHeaders.toggle();
	}
}

/**
 * Construct a request and send it.
 */
function sendRequest() {
	
	reset();
	
	if (!validate()) {
		return false;	
	}
	
	$("#loading").show();

    var ajaxArgs = {
		url: getURL("#url"),
        type: $("#method").val(),
    	contentType: "application/x-www-form-urlencoded",
        processData: true,
		beforeSend: processHeaders,
		dataType: "json",
        data: $("#requestBody").val(),
		success: successResponse,
		error: errorResponse
	};

    // some things change depending on the method
    var method = $("#method").val();
    if (method == "GET") {
        ajaxArgs.data = "";
    } else if (method == "POST") {
		ajaxArgs.processData = false;
        ajaxArgs.contentType = "application/json";
    }

    trackRequest(ajaxArgs.url);
    
	$.ajax(ajaxArgs);
}

/**
 * Get a URL string from the given selector and clean it up
 * by trimming and prefixing with http if necessary.
 */
function getURL(selector) {
    var url = $(selector).val().trim();
    return url.indexOf("http") != 0 ? "http://" + url : url;
}

/**
 * Add headers to the request. 
 */
function processHeaders(jqXHR) {
    $(".header").each(function() {
		var name = $(".name", this).val().trim();
        var value = $(".value", this).val().trim();
        
        if (name == "" || value == "") {
        	$(this).remove();
        } else {
	        jqXHR.setRequestHeader(name, value);
        }
    });
}

/**
 * Called when the AJAX response returns success.
 */
function successResponse(data, textStatus, jqXHR) {
	processResponse(jqXHR, true);
};

/**
 * Called when the AJAX response returns an error.
 */
function errorResponse(jqXHR, textStatus, errorThrown) {
	processResponse(jqXHR, false);
}

/**
 * Process a response. A successful (ie: non error) response is indicated by setting 'success' to true.
 */
function processResponse(jqXHR, success) {
	
	// response code and headers
	$("#responseCode").addClass(success ? "label-success" : "label-important");
	$("#responseCode").html(jqXHR.status + ": " + jqXHR.statusText);
	$("#responseHeaders").html(jqXHR.getAllResponseHeaders());

	// parse the response body if there is one
	var data = jqXHR.responseText;
	var contentType = jqXHR.getResponseHeader("Content-Type");
	if (contentType != null && contentType.indexOf("application/json") == 0 && data != null) {
		try {
	    	$("#response").html(JSON.stringify(JSON.parse(data), null, 2));
		} catch (exception) {
			
			// JSON must be invalid, just show it unparsed
	    	$("#response").html(data);
		}
	}
	
	// pretty print the response and response headers
	prettyPrint();
	
	// show the response
	$("#loading").hide();
	$("#responseCode").show();
	if ($("#response").html() != "") {
		$("#response").show();
	}
}

/**
 * Add a request header input field (name and value) to the page
 */
function addHeaderInput() {
	var header = $(".headerPrototype").clone();
	header.removeClass("headerPrototype");
	header.addClass("header");
	$("#requestHeaders").append(header);
	header.show();
}

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