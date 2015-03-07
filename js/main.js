showLoadingScreen();

var dataz;
var dataz2002 = [];
var dataz2006 = [];
var dataz2010 = [];

var clusters2002 = [];
var clusters2006 = [];
var clusters2010 = [];

var clustersByYear = [clusters2002, clusters2006, clusters2010];

var chosenYear = $("#selectYear option:selected").text();

d3.csv("data/databaosen.csv", function(error, data) {
    dataz = data;
    extractData();
    calculateClusters();
    initializeObjects();
    getClusterByYear(chosenYear);
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
  	// initialize UI components
  	sp1 = new sp();
	pc1 = new pc();
	map = new map();
	donut = new donut();
	
	// populate Select lists
	populateSelect();
	populateSelect2();
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
}

// Function to calculate clustering based on the data for a particular year. The data for each year is
// already stored in separate variables.
function selectYearAndCalculateClusters(year)
{
	chosenYear = year;
	//var newData = extractDataByYear(chosenYear);
	var newData;
	switch(chosenYear){
		case "2002":
			newData = dataz2002;
			dbscanRes = clusters2002;
			break;
		case "2006":
			newData = dataz2006;
			dbscanRes = clusters2006;
			break;
		case "2010":
			newData = dataz2010;
			dbscanRes = clusters2010;
			break;
		default:
			break;
	}
	//dbscanRes = dbscan(newData, 15, 5);
    console.log("changed clusters to: ");
    console.log(dbscanRes);
}

function calculateClusters()
{
	clusters2002 = dbscan(dataz2002, 15, 5);
	console.log(clusters2002);
	clusters2006 = dbscan(dataz2006, 15, 5);
	console.log(clusters2006);
	clusters2010 = dbscan(dataz2010, 15, 5);
	console.log(clusters2010);

	clustersByYear = [clusters2002, clusters2006, clusters2010];

	selectYearAndCalculateClusters(chosenYear);
}

function getClusterByYear(year)
{
	switch(year){
		case "2002":
			return clusters2002;
		case "2006":
			return clusters2006;
		case "2010":
			return clusters2010;
		default:
			console.log("getClusterByYear() Bad value!");
			return cluster2010;
	}
}

function findClusterByRegion(region)
{
	var clusters = (chosenYear == "2002") ? clusters2002 : (chosenYear == 2006) ? clusters2006 :  clusters2010;
	for(var i = 0; i < clusters.length; ++i)
	{
		for(var j = 0; j < clusters[i].length; ++j)
		{
			if(clusters[i][j]["region"] == region)
			{
				return i;
			}
		}
	}
	return -1;
}

function extractDataByYear(chosenYear)
{
	var tempData = [];
	for(var i = 0; i < dataz.length; ++i)
	{
		if(dataz[i]["år"] == chosenYear)
		{
			tempData.push(dataz[i]);
		}
	}
	return tempData;
}

function extractData()
{
	// extract headers from the data and store them in the clobal variable 'headers'
	extractHeaders();

	// extract data for each year
	dataz2002 = extractDataByYear("2002");
	dataz2006 = extractDataByYear("2006");
	dataz2010 = extractDataByYear("2010");	
}
