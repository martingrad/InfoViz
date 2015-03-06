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
var dbscanRes;
var headers;
var clusteringDims;

function initializeObjects()
{
  	sp1 = new sp();
	pc1 = new pc();
	map = new map();
	donut = new donut();
	extractHeaders();
	populateSelect();
	populateSelect2();
    dbscanRes = dbscan(dataz, 15, 5);
    console.log(dbscanRes);
}

function populateSelect2() {
	var selectOptionsForXAxis = document.getElementById("setXAxis");
	var selectOptionsForYAxis = document.getElementById("setYAxis");
	var options = [ headers[2],  headers[5], headers[6], headers[7], headers[8], headers[9],
						   headers[10], headers[11], headers[12], headers[13], headers[14] ];
	
	options.push("År");
	options.sort();
	options.unshift("Välj variabel");

	// For the ScatterPlot Y-Axis and X-axis
	for(var i = 0; i < options.length; i++)
	{
	  var opt = options[i];
	  if(options[i] == "arbetslöshet")
	  	opt = "Arbetslöshet";
	  if(options[i] == "inkomst")
	  	opt = "Inkomst";
	  if(options[i] == "övriga partier")
	  	opt = "Övriga partier";
	  
	  
	  var elX = document.createElement("option");
	  var elY = document.createElement("option");
	  
	  elX.textContent = opt;
	  elY.textContent = opt;
	  
	  elX.value = opt;
	  elY.value = opt;
	  
	  selectOptionsForXAxis.appendChild(elX);
	  selectOptionsForYAxis.appendChild(elY);
	}
}

function populateSelect() {
	var select = document.getElementById("selectRegion");
	
	// For the region dropdown list
	var var1 = "region";
	var options = [];
	var i = 0;
    while(dataz[i]["år"] == "2002"){
        options.push(dataz[i][var1]);
        ++i;
    }

    options.sort();
    options.unshift("Välj kommun");			// unshift pushes adds the argument in the beginning of the array

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

function extractHeaders()
{
	// store the data properties headers...
	headers = d3.keys(dataz[0]);
	// ... and extract and store the ones that are relevant
	clusteringDims = [ headers[6], headers[7], headers[8], headers[9],
					   headers[10], headers[11], headers[12], headers[13], headers[14] ];
	console.log(clusteringDims);
}

