var neighborsList : Array;
var x : int;
var y : int;
var charOn : boolean;
var type : String;
var model : tileModel;
var targetNum : int;

function init(x : int, y : int, type : String, charOn : boolean) {	
	this.x = x;
	this.y = y;
	this.type = type;
	neighborsList = [];
	this.charOn = charOn;
	targetNum=0; //for non targets
	
	// Add Child Model Object
	
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);
	model = modelObject.AddComponent("tileModel");	
	model.transform.parent = modelObject.transform;			// Make Tile the Parent of TileModel
	model.init(this, type);	
}

function isWall() {
	if(type == "x") return true;
	else return false;
}

function isPit() {
	if(type == "o") return true;
	else return false;
}

function addChar() { //we can change this to simply hold the character later, rather than an int
	charOn = true;
}

function makeTarget(localTargetNum : int, curTar: int) {
	model.makeTarget(localTargetNum, curTar);
	targetNum = localTargetNum; //increase to be the proper target number 11, etc.
}

function remChar() {
	charOn = false;
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
//	print(neighborsList);
}
//coding in the reset for now
function collect() {
	type="_";
	targetNum=0;
	model.collect();
}


