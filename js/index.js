(function ($) {

	var replace_location = function(resource) {
		var myHost = location.href.split("/")
		return myHost.slice(0, -1).join("/") + "/" + resource
	}

	$("#generate-results").click(function(e) {
		e.preventDefault()
		var newUrl = replace_location("results.html")
		location.replace(newUrl)
	});

	$("#show-results").click(function(e) {
		e.preventDefault();
		var device = $("#device-select option:selected").attr("value")
		var version = $("#version-select option:selected").attr("value")
		var myHost = location.href.split("/")
		var newUrl = replace_location(device + "/" 
					+ version + "/results_partial_daily.html");
		location.replace(newUrl)
	});

	/* Going back to defaults */
	$("#reset").click(function(e) {
		e.preventDefault()
		$("#device-select").val("flame-KK")
		$("#version-select").val("v2.1")
	})
})(jQuery);
