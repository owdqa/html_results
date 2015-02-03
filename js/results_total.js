
var results_total = (function Results() {
	var ROWS_TO_JUMP = 1;

	var DATE_COLUMN = 0;
	var TEST_PASSED_COLUMN = 2;
	var PERCENT_FAILED_COLUMN = 4;
	var LINK_COLUMN = 8;

			
	function handleError() {
		alert("No results found for your selection!!")
		//Going back
		location.href = location.href.split("/").slice(0,-2).join("/");
	};

	function processData(data) {
		var arrays = $.csv.toArrays(data);

		prev_info_arrays = arrays.slice(0, ROWS_TO_JUMP);
		table_arrays = arrays.slice(ROWS_TO_JUMP);

		var i = 0;
		for (i; i < prev_info_arrays.length; i++) {
			_appendPrevInfo(prev_info_arrays[i][0]);
		} 

		/** FILL THE TABLE **/
		var table = generateTable(table_arrays);

		$("body").append($(document.createElement("table"))
									.append(table)
									.attr("id", "results")
						);
		postprocessTable();
		$("#results").tablesorter({
			sortList: [[DATE_COLUMN, 1]],
			dateFormat: "dd/mm/yy",
			debug: true,

		}); // {sortList: [[0,0], [1,0]]}

		function _appendPrevInfo(what) {
			tokens = what.split(":");
			var elem = $(document.createElement("span"))
								.addClass("bolder orange")
								.html(tokens[tokens.length - 1]);

			$("#prev-info .info-wrapper").append($(document.createElement("div"))
									.attr("class", "info-elem")
									.append(tokens[0] + ":")
									.append(elem)
									);
	} 
	}

	function postprocessTable() {
		$.each($("#results tbody tr"), function(item, elem) {
			$.each($(elem).find("td"), function (item, elem) {
				if (item == PERCENT_FAILED_COLUMN) {
					var range = _whichRange(elem); 
					if (range !== "") {
						$(elem).closest("tr").addClass(range);
					}
				}
			})
		});

		_addLegend();
		function _addLegend() {
			var text_test_passed = "Test cassed passed over the total of tests executed"
			var text_percent_failed = "Percentage of test with an error (failed) over the total of tests executed"
			$.each($("#results thead th"), function (item, elem) {
				if (item == PERCENT_FAILED_COLUMN) {
					$(elem).attr({"title": text_percent_failed});
				} else if (item == TEST_PASSED_COLUMN) {
					$(elem).attr({"title": text_test_passed});
				}
			});
		};

		function _whichRange(elem) {
			var percent = parseInt($(elem).html().split("%")[0]);
			var result = "";
			((percent > 0) && (percent <= 20)) ? (result = "warning") : 
							(percent > 20) ? (result = "error") : (result = "")
			return result;
		}
	};

	// build HTML table data from an array (one or two dimensional)
	function generateTable(data) {
		var html = '';

		if (typeof(data[0]) === 'undefined') {
			return null;
		}

		if (data[0].constructor === String) {
			html += '<tr>\r\n';
			for (var item in data) {
				html += '<td>' + data[item] + '</td>\r\n';
			}
			html += '</tr>\r\n';
		}

		if (data[0].constructor === Array) {
			/*
			Do something to prevent unnecessary td fields
			*/
			for (var row in data) {

				if (data[row].length == 1) { //prevent from empty lines
					if (data[row][0] == "") {
						continue;
					}
				}

				if (row == 0) {
					var max = data[row].length; // This is gonna be my MAX
					html += '<thead>\r\n';
				} else if (row == 1) {
					html += '<tbody>\r\n';
				}
				html += '<tr>\r\n';

				for (var item in data[row]) {
					if (row > 0) { // not first row
						if (item < max) {
							if (item == LINK_COLUMN) {
								html += '<td><a href="' + _getPrefix() + data[row][item] +
								 '" target="_blank">' + 'Click here</a>'
							} else {
		  						html += '<td>' + data[row][item] + '</td>\r\n';
		  					}
						}
					} else {
		  				html += '<th>' + data[row][item] + '</th>\r\n';
					}
				}

				html += '</tr>\r\n';

				if (row == 0) {
					html += '</thead>\r\n';
				}
			}
			html += '</tbody>\r\n';
		}

		if(data[0].constructor === Object) {
			for(var row in data) {
		    	html += '<tr>\r\n';
		    	for(var item in data[row]) {
		      		html += '<td>' + item + ':' + data[row][item] + '</td>\r\n';
		    	}
		    	html += '</tr>\r\n';
		  	}
		}

		return html;
	}

	function _getPrefix() {
		var PUBLIC_ADDRESS =  "owd.tid.es";
		var PRIVATE_ADDRESS_1 = "owd-qa-server";
		var PRIVATE_ADDRESS_2 = "ci-owd-deven";
		var host_name = location.hostname

		if (host_name == PUBLIC_ADDRESS) {
			return "http://" + host_name + "/qaReports/owd_tests";
		} else if ((host_name == PRIVATE_ADDRESS_1) || (location.host.indexOf(PRIVATE_ADDRESS_2) > -1)) {
			return "http://" + host_name +"/owd_tests";
		} else {
			return ""
		}
	};
	return {
		processData : processData,
		handleError : handleError
	}

})();
