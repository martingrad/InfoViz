showLoadingScreen();

var dataz;
d3.csv("data/databaosen.csv", function(error, data) {
    dataz = data;
});

var sp1;
var pc1;
var map;
var donut;
//var val = new val();

setTimeout(function(){
  	console.log(dataz);
  	sp1 = new sp();
	pc1 = new pc();
	map = new map();
	donut = new donut();
}, 2000);


// var opts = {...} should be defined here and called in 'new Spinner(opts)...', but it doesn't seem to be working...
// Instead, the default values in spin.js has been changed...
var spinner;
var target;
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