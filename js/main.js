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
//var val = new val();

function initializeObjects(){
	console.log(dataz);
  	sp1 = new sp();
	pc1 = new pc();
	map = new map();
	donut = new donut();
}

// var opts = {...} should be defined here and called in 'new Spinner(opts)...', but it doesn't seem to be working...
// Instead, the default values in spin.js has been changed...

function showLoadingScreen()
{
	console.log("nu kör vi!");
    //target = document.getElementById('spinner-box');

	target = document.getElementById('spinner-box');
	spinner = new Spinner().spin(target);
}

function hideLoadingScreen()
{
	console.log("nu slutar vi!");
	spinner.stop();
}