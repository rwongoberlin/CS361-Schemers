var x : int;
var y : int;

var currentTile : tile; 
var prevTile : tile;
var nextTile : tile; 
var clock : int;
var type : int;
var rotation : int;

var tiles : Array;
//var characters : Array;

function init(row : int, column : int, r : int, Tile : tile, tileList : Array, typeL : int) {
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the texture.
//try find method
	type = typeL;
	rotation = r;
	tiles = tileList;
	currentTile = Tile;
	x = row;
	y = column;
	clock = 0.0;
	//this.characters = characters;
	transform.localPosition = Vector3(0,0, -0.001);		// Center the model on the parent.
	name = "Character";							// Name the object.
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

}

function pitReset() {
	currentTile = prevTile;
}

