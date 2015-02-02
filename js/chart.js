var chart = (function () {

	/*
		Global variables here
	 */
	var dates = [];
	var suites = [];
	var results = [];
	
	function handleError() {
		alert("Something went wrong");
	}

	function processData(raw_data) {
		var data = $.csv.toObjects(raw_data);
		_parseData(data);

		getTrain();
		getPicture(dates[dates.length - 1]);
	}

	function _parseData(input) {
		//Me llega un array de objetos. Cada objeto tiene DATE, SUITE, TESTS
		// Qué necesito para pintar
		// El eje X, las fechas
		// El eje Y los datasets --> Arrays de TESTS para cada  SUITE

		_getField(input, "DATE");
		fillSelect("#dateSelector");
		_getField(input, "SUITE");
		_getField(input, "RESULTS");

		/*console.log("Dates", dates);
		console.log("Suites", suites);
		console.log("Results", results);*/
	}

	function _getField(input, field) {

		var map = {"SUITE": suites, "DATE": dates};
		if (field === "RESULTS") {
			for (var i = 0; i < suites.length; i++) {
				var results_suite = [];
				for (var j = 0; j < input.length; j++) {
					var elem = input[j];
					if (elem["SUITE"] === suites[i]) {
						results_suite.push(parseInt(elem["TESTS"]));
					}
				}
				results.push(results_suite);
			}
		} else {
			for (var i = 0; i < input.length; i++) {
				var elem = input[i];
				var target = elem[field];
				var mappedVar = map[field];
				if (mappedVar.indexOf(target) === -1) {
					mappedVar.push(target); 
				}				
			}
		}
	}

	function getTrain() {

		_filler = function (index, date) {
			var tmp_object = {};
			tmp_object["date"] = date;

			for (var i = 0; i < suites.length; i++) {
				tmp_object[suites[i]] = results[i][index];
			}
			return tmp_object;
		};

		var dataSource = [];
		for (var i = 0; i < dates.length; i++) {
			dataSource.push(_filler(i, dates[i]));
		}

		$("#trainChart").dxChart({
		    dataSource: dataSource,
		    commonSeriesSettings: {
		        type: "spline",
		        argumentField: "date"
		    },
		    commonAxisSettings: {
		        grid: {
		            visible: true
		        }
		    },
		    series: getSeries(suites),
		    tooltip:{
		        enabled: true
		    },
		    legend: {
		        verticalAlignment: "bottom",
		        horizontalAlignment: "left"
		    },
		    title: "Test coverage over time",
		    commonPaneSettings: {
		        border:{
		            visible: true,
		            bottom: false
		        }
		    },
		});
	}

	function getSeries(suites) {
		var tmp_arr = [];
		for (var i = 0; i < suites.length; i++) {
			tmp_arr.push({
				valueField: suites[i], 
				name: suites[i]
			})
		}
		return tmp_arr;
	}

	function getPicture(date){

		/*console.log("Date for getPicture", date);
		console.log("Dates", dates);*/

		var pos = dates.indexOf(date);

		if (pos === -1) {
			alert("Not data found for that date! Try again");
			return;
		} else {
			setOptionSelected("#dateSelector", date);
			var dataSource = [];
			var testsForThatDate = _getTestsForDate(pos);
			// Creating dataSource structure
			for (var i = 0; i < testsForThatDate.length; i++) {
				dataSource.push({
					suite: suites[i],
					tests: testsForThatDate[i]	
				});
			};

			console.log("Data source", dataSource);

			$("#barChart").dxChart({
			    dataSource: dataSource,
			    series: {
			        argumentField: "suite",
			        valueField: "tests",
			        name: "Number of tests",
			        type: "bar",
			        color: 'rgb(215, 98, 10)'
			    },
		    	title: "Daily test coverage",
			    legend: {
			        verticalAlignment: "bottom",
			        horizontalAlignment: "center"
			    },
			    tooltip:{
			        enabled: true
			    },
		});

		}
	}

	function _getTestsForDate(position) {
		var tmp_arr = [];
		for (var i = 0; i < results.length; i++) {
			tmp_arr.push(results[i][position]);
		};
		return tmp_arr;
	}

	function fillSelect(id) {
		for (var i = 0; i < dates.length; i++) {
			$(id).append($(document.createElement("option")).html(dates[i]));
		};
	}

	function setOptionSelected(id, option) {
		$(id + " option").each(function(index, elem) {
			$elem = $(elem);
			if (option === $elem.html()) {
				$elem.attr("selected", true);
			}
		})
	}

	function _formatDate(date) {
		return date.getDate() + "/" + _pad(date.getMonth() + 1, 2)
	}
	function _pad(n, width, z) {
		z = z | 0;
		n = n + '';
  		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

	return {
		processData: 	processData,
		getTrain: 		getTrain,
		getPicture: 	getPicture,
		fillSelect: 	fillSelect,
		handleError: 	handleError
	}
})();
