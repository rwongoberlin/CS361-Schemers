var currentTile : tile; 
var prevTile : tile;
var nextTile : tile; 
var type : int;
var rotation : int;
//variables needed for movement calculation
var clock : float;
var moveTime : float = 0.25;
var t0 : float = 0;
var tend : float = 0;
var moving : boolean = false;
var deltat : float = 0;
var deltax : int = 0;
var deltay : int = 0;
var xinit : float = 0;
var yinit : float = 0;

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
	clock = 0;
	this.type = type;
	this.rotation = rotation;
	currentTile = t;
	name = "Character"+type;							
	
	if (type == 1) {
		renderer.material.mainTexture = Resources.Load("Textures/character_blue", Texture2D);		
		renderer.material.color = Color(1,1,1,0.25);										
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
	var dir : int = 5;
	var moved = false;
	if (moving) {
		return 5;
	}
	if (type == 1) {
		if (Input.GetKeyDown("right")) {
			currentTile = currentTile.neighborsList[0];
			dir = 0;
//			transform.eulerAngles = Vector3(0, 0, -90);
		}
		if (Input.GetKeyDown("down")) {
			currentTile = currentTile.neighborsList[1];
			dir = 1;
//			transform.eulerAngles = Vector3(0, 0, 180);
		}
		if (Input.GetKeyDown("left")) {
			currentTile = currentTile.neighborsList[2];
			dir = 2;
//			transform.eulerAngles = Vector3(0, 0, 90);
		}
		if (Input.GetKeyDown("up")) {
			currentTile = currentTile.neighborsList[3];
			dir = 3;
//			transform.eulerAngles = Vector3(0, 0, 0);
		}
		
	} else {
		if (Input.GetKeyDown("left")) {
			currentTile = currentTile.neighborsList[0];
			dir = 0;
//			transform.eulerAngles = Vector3(0, 0, -90);
		}
		if (Input.GetKeyDown("up")) {
			currentTile = currentTile.neighborsList[1];
			dir = 1;
//			transform.eulerAngles = Vector3(0, 0, 180);
		}
		if (Input.GetKeyDown("right")) {
			currentTile = currentTile.neighborsList[2];
			dir = 2;
//			transform.eulerAngles = Vector3(0, 0, 90);
		}
		if (Input.GetKeyDown("down")) {
			currentTile = currentTile.neighborsList[3];
			dir = 3;
//			transform.eulerAngles = Vector3(0, 0, 0);
		}
		
	}
	return dir;
}

//allows the character to move to a new tile after performing checks
function move(dir : int) {
	//TODO move check into gameManager
	if (currentTile.charOn == false && currentTile.isWall() == false) {
		prevTile.remChar();
		currentTile.addChar();
		smoothMove(dir);
		//transform.position.x = currentTile.x;
		//transform.position.y = currentTile.y;
		moved = true;
		return true;
	} else {
		currentTile = prevTile;
		return false;
	}

}

function smoothMove(dir : int) {
	xinit = transform.position.x;
	yinit = transform.position.y;
	t0 = clock;
	tend = clock + moveTime;
	if (dir == 0) {
		deltax  = -1;
	}
	if (dir == 1) {
		deltay = 1;
	}
	if (dir == 2) {
		deltax = 1;
	}
	if (dir == 3) {
		deltay = -1;
	}
	moving  = true;
}

//is called when the character CANNOT move to its next tile
function pitReset() {
	currentTile = prevTile;
}

function Update() {
	if (moving) {
		deltat = clock - t0;
		transform.position = Vector3(xinit + (deltax*deltat/moveTime), yinit + (deltay*deltat/moveTime), -0.1);
		if (clock >= tend) {
			moving =false;
			deltax = 0;
			deltay = 0;
			t0 = 0;
			tend = 0;
			deltat = 0;
			transform.position.x = currentTile.x;
			transform.position.y = currentTile.y;
			xinit = transform.position.x;
			yinit = transform.position.y;
		}
	}
	clock = clock + Time.deltaTime;
}