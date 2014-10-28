var currentTile : tile; 
var prevTile : tile;
var nextTile : tile; 
var clock : int;
var type : int;
var rotation : int;

//var tiles : Array;
//var characters : Array;
/*
init function takes the:
	current rotation (int)
	underlying tile object (tile)
	character type (int)
*/
function init(rotation : int, t : tile, type : int) {
//	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the texture.
//try find method
	this.type = type;
	this.rotation = rotation;
	currentTile = t;
	clock = 0.0;
	name = "Character"+type;							// Name the object.
	// ADD TEXTURE
	
	if (type == 1) {
		renderer.material.mainTexture = Resources.Load("Textures/character_blue", Texture2D);		// Set the texture.  Must be in Resources folder.
	//	renderer.material.mainTexture = Resources.Load("Textures/modelbackup", Texture2D);	
		renderer.material.color = Color(1,1,2);										

	} 
	else {
		renderer.material.mainTexture = Resources.Load("Textures/character_red", Texture2D);		// Set the texture.  Must be in Resources folder.
	//	renderer.material.mainTexture = Resources.Load("Textures/modelbackup", Texture2D);	
		renderer.material.color = Color(1,1,1);										
	}																					// Set the color (easy way to tint things).		renderer.material.color = Color(1,1,1);										

	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	//if (rotation == 2) { transform.eulerAngles = Vector3(0, 0, 90); }  
	//else if (rotation == 1) { transform.eulerAngles = Vector3(0, 0, 180); }  
	//else if (rotation == 0) { transform.eulerAngles = Vector3(0, 0,  -90); } 
}

function setTile() {
	// will be able to remove setNeighbors and replace with a simple movement scheme
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


function move() {
	if (currentTile.charOn == false && currentTile.isWall() == false) {
		//print("charMove");
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

