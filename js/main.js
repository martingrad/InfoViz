showLoadingScreen();

var dataz;
d3.csv("data/databaosen.csv", function(error, data) {
    dataz = data;
    initializeObjects();
    hideLoadingScreen();
});

var sp1;
var pc1;
var map;
var donut;
var spinner;
var target;
var dbscanner;
var point_data = [];
var point_assignment_result

function initializeObjects()
{
  	sp1 = new sp();
	pc1 = new pc();
	map = new map();
	donut = new donut();
	populateSelect();
    var dbscanRes = dbscan(dataz, 1, 1);
}

function populateSelect() {
	var select = document.getElementById("selectScatterPlotYAxis");

	var var1 = "region";
	var options = [];
	var i = 0;
    while(dataz[i]["år"] == "2002"){
        options.push(dataz[i][var1]);
        ++i;
    }

    options.sort();

	for (var i = 0; i < options.length; i++) {
	  var opt = options[i];
	  var el = document.createElement("option");
	  el.textContent = opt;
	  el.value = opt;
	  select.appendChild(el);
	}
}

function showLoadingScreen()
{
	console.log("nu kör vi!");

	// var opts = {...} should be defined and called in 'new Spinner(opts)...', but it doesn't seem to be working...
	// Instead, the default values in spin.js have been changed...
	target = document.getElementById('spinner-box');
	spinner = new Spinner().spin(target);
}

function hideLoadingScreen()
{
	console.log("nu slutar vi!");
	spinner.stop();
}

