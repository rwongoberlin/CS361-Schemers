var tiles : Array;
var graph : Array;
var numNodes : int;
var height : int;
var width : int;

function init (tiles : Array, h : int, w : int){
	height = h;
	width = w;
	numNodes = width*height*width*height*16+1;
	graph = new Array(numNodes);
	for (int i = 0; i < numNodes) {
		graph[i] = new Array(numNodes);
	}
	fillGraph();
}

function getLinearFromCoords(x : int, y : int) {
	return x*height + y;
}

function getXFromLinear(num : int) {
	return (int)(num / height);
}

function getYFromLinear(num : int) {
	return num % height;
}

function getGraphEntry(greenPosX : int, GreenPosY : int, PurplePosX : int, PurplePosY : int, greenTargets : int, purpleTargets : int) {
	var GreenPos = getLinearFromCoords(GreenPosX, GreenPosY);
	var PurplePos = getLinearFromCoords(PurplePosX, PurplePosY);
	return GreenPos*width*height*16 + PurplePos*16 + greenTargets*4 + PurpleTargets;
}

function getGreenCoords(num : int) {
	return num / (width * height * 16);
}

function getPurpleCoords(num : int) {
	return (num % (width * height * 16)) / 16;
}

function fillGraph() {
	var gx : int;
	var gy : int;
	var px : int;
	var py : int;
	for (int i = 0; i < numNodes - 1) {
	}
}













