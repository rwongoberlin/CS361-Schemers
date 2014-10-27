
var neighborsList : Array;
var x : float;
var y : float;
var charOn : int; // if 0, nothing on, if 1, character is on tile
var isWall : int;
var type : int;
var model;
var isPit : int;
var targetNum : int; //

function init(xS : float, yS : float) {
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	
	x = xS;
	y = yS;
	neighborsList = new Array();
	charOn = 0;
	isWall = 0;
	isPit=0;
	type = 0;
	targetNum=0; //for non targets
	model = modelObject.AddComponent("tileModel");	
	model.init(this);	
}	
function addChar() { //we can change this to simply hold the character later, rather than an int
	charOn = 1;
}
function makeWall() {
	isWall = 1;
	model.makeWall();
}
function makePit() {
	isPit = 1;
	model.makePit();
}

function makeTarget(localTargetNum : int, curTar: int) {
	model.makeTarget(localTargetNum, curTar);
	targetNum = localTargetNum; //increase to be the proper target number 11, etc.
}

function remChar() {
	charOn = 0;
}

function getX() {
	return x;
}

function getY() {
	return y;
}
//may need to return a different value based on indexing
function getTargetNum() {
	return targetNum;
}
function addNeighbors(T : tile) { //x is the length of tiles, y is length of tiles[0]
	neighborsList.Add(T);
}
//coding in the reset for now
function collect() {
	type=0;
	targetNum=0;
	model.collect();
}


