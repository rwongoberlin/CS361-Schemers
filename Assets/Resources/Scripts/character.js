var currentTile : tile; 
var prevTile : tile;
var nextTile : tile; 
var type : int;
var rotation : int;

//variables to determine what kind of movement is underway currently.  At most one of these should be true at any given time (ie reset them after movement is finished)
var moving : boolean = false;
var shaking : boolean = false;
var spinning : boolean = false;
var winning : boolean = false;

//variables needed for smooth movement calculation (the "t" variables are used in all animations)
var clock : float;
var moveTime : float = 0.23;	//total time in which the movement is done; increase for slower movement, decrease for faster movement
var t0 : float = 0;				//used in calculation.  Don't touch.
var tend : float = 0;			//used in calculation.  Determined by clock and moveTime - don't directly adjust
var deltat : float = 0;			//used in calculation.  Don't touch.
var deltax : int = 0;			//I think you see the pattern here.
var deltay : int = 0;			//Don't touch this either
var xinit : float = 0;			//Or this.
var yinit : float = 0;			//or even this

var spint0 : float = 0;
var spintend : float = 0;
var spindeltat : float = 0;


//variables for shaking calculation
var numShakes : float = 2.0;		//the number of full shake cycles the animation will undergo (where 1 shake cycle goes middle > left > right > middle).  Adjust this as you see fit, but keep as a positive integer value.
var shakeTime : float = 0.25;	//total time in which the shake(s) will be completed.  Probably should be the same as moveTime, but it doesn't really matter.  Adjust as you see fit.
var shakeAngle : int = 10;		//the maximum angle (from the vertical axis) of each shake.  The difference in rotation between the clockwise and counterclockwise extents of the shakes will be 2  * shakeAngle.

var spinTime : float = 0.6;
var numSpins : float = 3;

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
	if (type == 1) {
		if (Input.GetKeyDown("right")||Input.GetKeyDown("d")) {
			currentTile = currentTile.neighborsList[0];
			dir = 0;
//			transform.eulerAngles = Vector3(0, 0, -90);
		}
		if (Input.GetKeyDown("down")||Input.GetKeyDown("s")) {
			currentTile = currentTile.neighborsList[1];
			dir = 1;
//			transform.eulerAngles = Vector3(0, 0, 180);
		}
		if (Input.GetKeyDown("left")||Input.GetKeyDown("a")) {
			currentTile = currentTile.neighborsList[2];
			dir = 2;
//			transform.eulerAngles = Vector3(0, 0, 90);
		}
		if (Input.GetKeyDown("up")||Input.GetKeyDown("w")) {
			currentTile = currentTile.neighborsList[3];
			dir = 3;
//			transform.eulerAngles = Vector3(0, 0, 0);
		}
		
	} else {
		if (Input.GetKeyDown("left")||Input.GetKeyDown("a")) {
			currentTile = currentTile.neighborsList[0];
			dir = 0;
//			transform.eulerAngles = Vector3(0, 0, -90);
		}
		if (Input.GetKeyDown("up")||Input.GetKeyDown("w")) {
			currentTile = currentTile.neighborsList[1];
			dir = 1;
//			transform.eulerAngles = Vector3(0, 0, 180);
		}
		if (Input.GetKeyDown("right")||Input.GetKeyDown("d")) {
			currentTile = currentTile.neighborsList[2];
			dir = 2;
//			transform.eulerAngles = Vector3(0, 0, 90);
		}
		if (Input.GetKeyDown("down")||Input.GetKeyDown("s")) {
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

function spinny() {
	spint0 = clock;
	spintend = clock + spinTime;
	spinning = true;
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

//Sets up the shaking animation (which will be handled in the Update function)
function pitShake() {
	t0 = clock;
	tend = clock + shakeTime;
	shaking = true;
}

//Shakes to inform player that their move is invalid.
//function shakeIt() {
//	
//}

function Update() {
	//If we're supposed to be moving between tiles, the following if clause helps to set the character's position.
	if (moving) {
		deltat = clock - t0;																						//updates the time since start of movement
		//DO NOT CHANGE THE FOLLOWING LINE
		transform.position = Vector3(xinit + (deltax*deltat/moveTime), yinit + (deltay*deltat/moveTime), -0.1);		//Sets the current position based on the movement variables.  See the variables up top to mess with how this works, don't edit this part.
		//If it's time to be done moving, clean everything up and set moving status to false
		if (clock >= tend) {
			moving = false;
			deltax = 0;
			deltay = 0;
			t0 = 0;
			tend = 0;
			deltat = 0;
			//If there's no update precisely when we reach our destination, we want to reset to the middle of the current tile.
			transform.position.x = currentTile.x;
			transform.position.y = currentTile.y;
			xinit = transform.position.x;
			yinit = transform.position.y;
		}
	}
	//If we're supposed to be shaking, this handles how that works.
	if (shaking) {
		deltat = clock - t0;																						//updates times since start of animation
		//DO NOT CHANGE THE FOLLOWING LINE
		transform.eulerAngles = Vector3(0, 0, (shakeAngle * Mathf.Sin(2.0*Mathf.PI*deltat/(shakeTime/numShakes))));	//Sets the current rotation based on the animation variables.  Change the variables up top to tweak this, don't change the function here.
		//If it's time to stop shaking, clean everything up and set shaking status to false
		if (clock >= tend) {
			shaking = false;
			t0 = 0;
			tend = 0;
			deltat = 0;
			transform.eulerAngles = Vector3(0, 0, 0);																//This is just to reset back to normal rotation in case something weird happens with the updates.
		}
	}
	//If we're supposed to be spinning, this handles how that works.
	if (spinning) {
		spindeltat = clock - t0;
		//DO NOT CHANGE THE FOLLOWING LINE
		transform.eulerAngles = Vector3(0, 0, 360*numSpins*spindeltat/spinTime);
		//If it's time to stop spinning, clean everything up and set shaking status to false
		if (clock >= spintend) {
			if (!winning) {
				spinning = false;
				spint0 = 0;
				spintend = 0;
				spindeltat = 0;
				transform.eulerAngles = Vector3(0, 0, 0);
			}
		}
	}
	clock = clock + Time.deltaTime;																					//Updates the clock.  Super important.
}