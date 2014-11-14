var neighborsList : Array;					//list of neighboring tiles E, S, W, N.
var x : int;								//x coordinate
var y : int;								//y coordinate
var charOn : boolean;						//whether or not a character is on the tile
var type : String;							//whether tile is null, a wall, or pit.
var model : tileModel;						//for the tileModel texture
var targetNum : int;						//which number/type of target tile contains, if it contains a target.
var tempType : String = "_";
var editMode : int;

function init(x : int, y : int, type : String, charOn : boolean) {	
	this.x = x;
	this.y = y;
	this.type = type;
	neighborsList = [];
	this.charOn = charOn;
	targetNum=0; //for non targets
	editMode = 0;
	
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);
	model = modelObject.AddComponent("tileModel");	
	model.transform.parent = modelObject.transform;			// Make Tile the Parent of TileModel
	model.init(this, type);	
}

function Update() {
	if (editMode == 1) {
		model.tempType = tempType;
	}
}

function getType() {
	return model.type;
}

function makeEditable() {
	editMode = 1;
}

//returns true if tile is wall
function isWall() {
	if(type == "x") return true;
	else return false;
}

//returns true if tile is pit
function isPit() {
	if(type == "o") return true;
	else return false;
}

//changes charOn to true.
function addChar() { 
	charOn = true;
}

//turn the current tile into a target
//*Params: localTargetNum (target number ), curTar (the target we're supposed to collect)
function makeTarget(localTargetNum : int, curTar: int) {
	model.makeTarget(localTargetNum, curTar);
	targetNum = localTargetNum; //increase to be the proper target number 11, etc.
}

//changes charOn to false.
function remChar() {
	charOn = false;
}


function getX() {
	return x;
}

function getY() {
	return y;
}

function getTargetNum() {
	return targetNum;
}

//allows setNeighbors in gameManager to add tile's neighbors to its neighborsList
function addNeighbors(T : tile) { //x is the length of tiles, y is length of tiles[0]
	neighborsList.Add(T);
}

//turn tile into a blank tile
function collect() {
	type="_";
	targetNum=0;
	model.collect();
}


