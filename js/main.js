showLoadingScreen();

var sp1 = new sp();

var pc1 = new pc();

var map = new map();

var donut = new donut();
//var val = new val();


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