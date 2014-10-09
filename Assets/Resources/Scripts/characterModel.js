var owner : character;

var x : float;
var y : float;

var currentTile : tile; 
var speed : float;

var type : int;

var xLen : float;
var yLen : float;
var rotation : float;

var tiles : Array;
var targetCount : int;
var targets : Array;
var curTar : target;
var tCount : int;
var neighborsList : Array;


function init(o : character, row : float, column : float, r : float, Tile : tile, tileList : Array, typeL : int, targetsS : Array) {
	owner = o;										
	
	neighborsList = targetsS;
	type = typeL;
	rotation = r;
	tiles = tileList;
	currentTile = Tile;
	x = row;
	y = column;
	clock = 0.0;
	speed = 1.0;
	xLen = tiles.length-1;
	yLen = tiles[0].length-1;
	targets = targetsS;
	targetCount = 1;
	tCount = 0;
	curTar = null;
	
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0, -0.001);		// Center the model on the parent.
	name = "Character Model";							// Name the object.
	
	renderer.material.mainTexture = Resources.Load("Textures/char1", Texture2D);		// Set the texture.  Must be in Resources folder.
	if (type == 0) {
		renderer.material.color = Color.red;	
	} else {
		renderer.material.color = Color(1,1,1);		
	}																					// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	
	if (rotation == 2) { transform.eulerAngles = Vector3(0, 0, 90); }  
	else if (rotation == 1) { transform.eulerAngles = Vector3(0, 0, 180); }  
	else if (rotation == 0) { transform.eulerAngles = Vector3(0, 0,  -90); } 
}

function legalMove(pos : int) {
	if (currentTile.neighborsList[pos].type == 1) {
		return false;
	}
	else 
		return true;
}

function pitMove(pos : int, person : int) {
	if (currentTile.neighborsList[pos].type == 2) {
		return true;
	}
	if (this.people[(person + 1) % 2].currentTile.neighborsList[(pos + 2) % 4].type == 2) {
		return true;
	}
	else {
		return false;
	}
}
/*
function Update() {
	var prevTile = currentTile;
	var moved = false;
	if (type == 0) {
		if (Input.GetKeyDown("right")) {
			if (legalMove(0) && !(pitMove(0, 0))) {
				currentTile = currentTile.neighborsList[0];
				transform.position.x = currentTile.x;
				transform.position.y = currentTile.y;
			}
		}
		if (Input.GetKeyDown("down")) {
			if (legalMove(1) && !(pitMove(1, 0))) {
				currentTile = currentTile.neighborsList[1];
				transform.position.x = currentTile.x;
				transform.position.y = currentTile.y;
			}
		}
		if (Input.GetKeyDown("left")) {
			if (legalMove(2) && !(pitMove(2, 0))) {
				currentTile = currentTile.neighborsList[2];
				transform.position.x = currentTile.x;
				transform.position.y = currentTile.y;
			}
		}
		if (Input.GetKeyDown("up")) {
			if (legalMove(3) && !(pitMove(3, 0))) {
				currentTile = currentTile.neighborsList[3];
				transform.position.x = currentTile.x;
				transform.position.y = currentTile.y;
			}
		}
	} else {
		if (Input.GetKeyDown("left")) {
			if (legalMove(0) && !(pitMove(0, 1))) {
				currentTile = currentTile.neighborsList[0];
				transform.position.x = currentTile.x;
				transform.position.y = currentTile.y;
			}
		}
		if (Input.GetKeyDown("up")) {
			if (legalMove(1) && !(pitMove(1, 1))) {
				currentTile = currentTile.neighborsList[1];
				transform.position.x = currentTile.x;
				transform.position.y = currentTile.y;
			}
		}
		if (Input.GetKeyDown("right")) {
			if (legalMove(2) && !(pitMove(2, 1))) {
				currentTile = currentTile.neighborsList[2];
				transform.position.x = currentTile.x;
				transform.position.y = currentTile.y;
			}
		}
		if (Input.GetKeyDown("down")) {
			if (legalMove(3) && !(pitMove(3, 1))) {
				currentTile = currentTile.neighborsList[3];
				transform.position.x = currentTile.x;
				transform.position.y = currentTile.y;
			}
		}
	}
	if (currentTile.charOn == 0) {
		prevTile.remChar();
		currentTile.addChar();
		transform.position.x = currentTile.x;
		transform.position.y = currentTile.y;
		moved = true;
	} else {
		currentTile = prevTile;
	}
	if (moved && currentTile.t) {
		curTar = currentTile.getTarget();
		if (curTar.getCount() == targetCount) {
			currentTile.remTargets();
			curTar.destroy();
			targetCount++;
			//print("hit a target!");
		}
	}
}
*/

function Update() {
	// will be able to remove setNeighbors and replace with a simple movement scheme
	var prevTile = currentTile;
	var moved = false;
	if (type == 0) {
		if (Input.GetKeyDown("right")) {
			currentTile = currentTile.neighborsList[0];
			transform.eulerAngles = Vector3(0, 0, -90);
		}
		if (Input.GetKeyDown("down")) {
			currentTile = currentTile.neighborsList[1];
			transform.eulerAngles = Vector3(0, 0, 180);
		}
		if (Input.GetKeyDown("left")) {
			currentTile = currentTile.neighborsList[2];
			transform.eulerAngles = Vector3(0, 0, 90);
		}
		if (Input.GetKeyDown("up")) {
			currentTile = currentTile.neighborsList[3];
			transform.eulerAngles = Vector3(0, 0, 0);
		}
		
	} else {
		if (Input.GetKeyDown("left")) {
			currentTile = currentTile.neighborsList[0];
			transform.eulerAngles = Vector3(0, 0, -90);
		}
		if (Input.GetKeyDown("up")) {
			currentTile = currentTile.neighborsList[1];
			transform.eulerAngles = Vector3(0, 0, 180);
		}
		if (Input.GetKeyDown("right")) {
			currentTile = currentTile.neighborsList[2];
			transform.eulerAngles = Vector3(0, 0, 90);
		}
		if (Input.GetKeyDown("down")) {
			currentTile = currentTile.neighborsList[3];
			transform.eulerAngles = Vector3(0, 0, 0);
		}
		
	}
	
	if (currentTile.charOn == 0) {
		prevTile.remChar();
		currentTile.addChar();
		transform.position.x = currentTile.x;
		transform.position.y = currentTile.y;
		moved = true;
	} else {
		currentTile = prevTile;
	}
	if (moved && currentTile.t) {
		curTar = currentTile.getTarget();
		if (curTar.getCount() == targetCount) {
			currentTile.remTargets();
			curTar.destroy();
			targetCount++;
			//print("hit a target!");
		}
	}
}  
