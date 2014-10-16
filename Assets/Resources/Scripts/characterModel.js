var owner : character;

var x : float;
var y : float;

var currentTile : tile;
var prevTile : tile;
var speed : float;

var type : int;

var xLen : float;
var yLen : float;
var rotation : float;

var tiles : Array;
var targetCount : int;
var curTar : int; //now is an int for the number of the target we are supposed to collect
var tCount : int;
var characters : Array;


function init(o : character, row : float, column : float, r : float, Tile : tile, tileList : Array, typeL : int, characters : Array) {
	owner = o;										
	
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
	targetCount = 1;
	tCount = 0;
	curTar = 1; 
	this.characters = characters;
	
	
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0, -0.001);		// Center the model on the parent.
	name = "Character Model";							// Name the object.
	
	if (type == 1) {
	renderer.material.mainTexture = Resources.Load("Textures/character_blue", Texture2D);		// Set the texture.  Must be in Resources folder.
	} else {
	renderer.material.mainTexture = Resources.Load("Textures/character_red", Texture2D);		// Set the texture.  Must be in Resources folder.
	}																					// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	
	if (rotation == 2) { transform.eulerAngles = Vector3(0, 0, 90); }  
	else if (rotation == 1) { transform.eulerAngles = Vector3(0, 0, 180); }  
	else if (rotation == 0) { transform.eulerAngles = Vector3(0, 0,  -90); } 
	
}

function setTile() {
	// will be able to remove setNeighbors and replace with a simple movement scheme
	prevTile = currentTile;
	var moved = false;
	if (type == 1) {
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
}
	
	/*So I've done some testing and I don't get the Null Reference exception in other cases where I try to check something about the other tile.
	I'm thinking it's a problem with using currentTile to check - I think the first character does all of this stuff before the second character tries to move
	(ie before it has a current tile).
	Not sure how we can solve this cleanly with the movement model we're using.
	*/
	function move() {
	if (currentTile.charOn == 0 && currentTile.isWall == 0) {
		prevTile.remChar();
		currentTile.addChar();
		transform.position.x = currentTile.x;
		transform.position.y = currentTile.y;
		moved = true;
	} else {
		currentTile = prevTile;
	}

	//if we have moved, and we're actually stepping on a target
		curTar = currentTile.getTargetNum();
		//print(curTar);
	if (moved && (curTar!=0)) {
		if (curTar%10 == targetCount && curTar/10 == type) { //integer division since char 1's targets are type 11-19, 2's 21-29
			//currentTile.remTargets();
			currentTile.collect();
			targetCount++;
			//print("hit a target!");
		}
	}
}

function pitReset() {
	currentTile = prevTile;
}









