var currentTile : tile; 
var prevTile : tile;
var nextTile : tile; 
var type : int;
var rotation : int;

//TO DO: remove rotation (?)

//var tiles : Array;
//var characters : Array;
/*
init function takes the:
	current rotation (int)
	underlying tile object (tile)
	character type (int)
*/
function init(rotation : int, t : tile, type : int) {
	this.type = type;
	this.rotation = rotation;
	currentTile = t;
	name = "Character"+type;							
	
	if (type == 1) {
		renderer.material.mainTexture = Resources.Load("Textures/character_blue", Texture2D);		
		renderer.material.color = Color(1,1,2);										
	} 
	else {
		renderer.material.mainTexture = Resources.Load("Textures/character_red", Texture2D);		
		renderer.material.color = Color(1,1,1);										
	}	

	renderer.material.shader = Shader.Find ("Transparent/Diffuse");	
}

//allows the character to get information on its next tile based on what key the user presses.
function setTile() {
	prevTile = currentTile;
	var moved = false;
	if (type == 1) {
		if (Input.GetKeyDown("right")) {
			currentTile = currentTile.neighborsList[0];
//			transform.eulerAngles = Vector3(0, 0, -90);
		}
		if (Input.GetKeyDown("down")) {
			currentTile = currentTile.neighborsList[1];
//			transform.eulerAngles = Vector3(0, 0, 180);
		}
		if (Input.GetKeyDown("left")) {
			currentTile = currentTile.neighborsList[2];
//			transform.eulerAngles = Vector3(0, 0, 90);
		}
		if (Input.GetKeyDown("up")) {
			currentTile = currentTile.neighborsList[3];
//			transform.eulerAngles = Vector3(0, 0, 0);
		}
		
	} else {
		if (Input.GetKeyDown("left")) {
			currentTile = currentTile.neighborsList[0];
//			transform.eulerAngles = Vector3(0, 0, -90);
		}
		if (Input.GetKeyDown("up")) {
			currentTile = currentTile.neighborsList[1];
//			transform.eulerAngles = Vector3(0, 0, 180);
		}
		if (Input.GetKeyDown("right")) {
			currentTile = currentTile.neighborsList[2];
//			transform.eulerAngles = Vector3(0, 0, 90);
		}
		if (Input.GetKeyDown("down")) {
			currentTile = currentTile.neighborsList[3];
//			transform.eulerAngles = Vector3(0, 0, 0);
		}
		
	}
}

//allows the character to move to a new tile after performing checks
function move() {
	//TODO move check into gameManager
	if (currentTile.charOn == false && currentTile.isWall() == false) {
		prevTile.remChar();
		currentTile.addChar();
		transform.position.x = currentTile.x;
		transform.position.y = currentTile.y;
		moved = true;
		return true;
	} else {
		currentTile = prevTile;
		return false;
	}

}

//is called when the character CANNOT move to its next tile
function pitReset() {
	currentTile = prevTile;
}

