var tiles : Array;
var graph : Array;
var numNodes : int;
var height : int;
var width : int;

function init (tiles : Array, h : int, w : int){
	height = h;
	width = w;
	numNodes = height*width*16 + 1;
	graph = new Array(numNodes);
	for (int i = 0; i < numNodes) {
		graph[i] = new Array(numNodes);
	}
	fillGraph();
}

function getGraphEntry(x : int, y : int, greenTargets : int, purpleTargets : int) {
	return graph[(x * width * 16) + (y * 16) + (greenTargets * 4) + purpleTargets];
}

function fillGraph() {
}