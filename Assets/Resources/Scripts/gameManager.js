/*
FALL BREAK GAME MANAGER
*/

import System.IO;

var tileFolder : GameObject;
var tiles : Array;

var characterFolder : GameObject;
var characters : Array;
var blueChar : character;
var redChar : character;

var curTarBlue : int = 1; //default starting target number is one
var curTarRed : int = 1; //default starting target number is one
var redTargets: Array; //array for holding the tile objects of redTargets
var blueTargets: Array;  //array for holding the tile objects of the blue targets
var blueInit : Array;
var redInit : Array;
//need to handle edge case for when characters move into the same square, but only one collects

var turns : turnCounter;
var level : String = "Assets/Resources/Levels/devin3.txt";

// Called once when the script is created.
function Start () {
	tileFolder = new GameObject();
	tileFolder.name = "TileFolder";
	
	characterFolder = new GameObject();
	characterFolder.name = "CharacterFolder";
	
	blueTargets = new Array(3);
	redTargets = new Array(3);
	
	buildMap(level);
	blueChar = addCharacter(blueInit[0], blueInit[1], 0, 1);
	redChar = addCharacter(redInit[0], redInit[1], 0, 2);
	setNeighbors();
	

	audioSource = gameObject.AddComponent("AudioSource");
	audio.PlayOneShot(Resources.Load("Sounds/loop1"), 1);

}

function buildMap(map : String) {	
	try {
        // Create an instance of StreamReader to read from a file.
        sr = new StreamReader("Assets/Resources/Levels/devin3.txt");
        // Read and display lines from the file until the end of the file is reached.
        line = sr.ReadLine();
        width = parseInt(line);
        line = sr.ReadLine();
        height = parseInt(line);
        tiles = new Array();
        line = sr.ReadLine();
        y=0;
        while (line != null) {
        	tiles[y] = new Array();
            row = line.Split(' '[0]);
            for( x = 0; x < width; x++) {
				addTile(x, y, row[x]);
            }
            line = sr.ReadLine();
            y++;
        }
        sr.Close();
    }
    catch (e) {
        // Let the user know what went wrong.
        print("The level text file could not be read:");
        print(e.Message);
    }
}

// Called every frame.
function Update () {
	blueChar.setTile();
	redChar.setTile();
	if (pitCheck() && sameSpaceCheck() && targetBlockedCheck()) {
		blueChar.move();
		redChar.move();
		//curTarRed=curTarBlue; ///for if only one target
		//target check
		if(blueChar.currentTile.model.collectable) {
			collectBlue();
			if(curTarBlue==curTarRed) {
			audio.Stop();
			audio.PlayOneShot(Resources.Load("Sounds/loop"+(curTarRed-1)), 1);
			}
		}
		if(redChar.currentTile.model.collectable) {
			collectRed();
			if(curTarBlue==curTarRed) {
			audio.Stop();
			audio.PlayOneShot(Resources.Load("Sounds/loop"+(curTarRed-1)), 1);
			}
		}
		//	print("blue is "+curTarBlue+" . Red is : "+curTarRed);
		//for next loop
		
	}
	else {
		blueChar.pitReset();
		redChar.pitReset();
	}

} 

//returns true if both characters are not moving into pits
function pitCheck() {
	return (!blueChar.currentTile.isPit() && !redChar.currentTile.isPit());
}

//returns true if both characters are not moving into the same space
function sameSpaceCheck() {
	return blueChar.currentTile!=redChar.currentTile;
}

//returns false if either character tries to move into a target they are not allowed to collect
//just cases to make it false
function targetBlockedCheck() {
		curTar1 = blueChar.currentTile.getTargetNum();
		curTar2 = redChar.currentTile.getTargetNum();
		if ((curTar1==0) && (curTar2==0)) {
			return true;
		}

// //checking to see if going for wrong character's target
	if((curTar1/10 == 2) || curTar2/10 == 1) {
		return false; 
 	}
 //	print(curTarBlue);
// //checking to see if going for wrong number target
	if (!(curTar1%10 == curTarBlue) && curTar1!=0) {
		return false;
	}
	if (!(curTar2%10 == curTarRed) && curTar2!=0) {
		return false;
	}
		return true;
	
}

function setNeighbors() {
	var width = tiles[0].length - 1;
	var height = tiles.length - 1;
	for(y = 1; y<height; y++) {
		for(x=1; x<width; x++) {
			tiles[y][x].addNeighbors( tiles[y][x-1]);
			tiles[y][x].addNeighbors( tiles[y+1][x]);
			tiles[y][x].addNeighbors( tiles[y][x+1]);
			tiles[y][x].addNeighbors( tiles[y-1][x]);
				
		}
	}
}

/*
addCharacter takes:
	x position (int)
	y position (int)
	rotation (int)
	type (int, 1 or 2)
*/
function addCharacter(x : int, y : int, rotation : int, type : int) {
	var characterObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// New Empty Game Object
	var characterScript = characterObject.AddComponent("character");		// Add "CHARACTER" Component

	characterScript.transform.parent = characterFolder.transform;			// Make CharacterFolder the Parent
	characterScript.transform.position = Vector3(x, y, -0.001);					// Set Transform to Correct Coordinate

	var myTile = tiles[y][x];
	characterScript.init(rotation, myTile, type);							// Initialize CharacterScript
	characterScript.name = "character " + type;								// Name CharacterScript
	return characterScript;
}

/*
addTile (float, float, String) method by Devin
added to support tile creation w/ different types of tiles

character 1 = 1
character 2 = 2
blank tile = _
wall = x
pit = o

targets for char 1 = A B C D
targets for char 2 = a b c d
*/
function addTile (x : int, y : int, tileType : String) {
	var tileObject = new GameObject();
	var charOn = false;
	var character = 0;
	// check to see if this tile has a character or a target on it
	// if so, add that AND a blank tile
	if( tileType == "1" ) {				// if it is the blue characer
		tileType == "_";
		character = 1;
		charOn = true;
		blueInit = [x,y];
	} else if( tileType == "2" ) { 		// if it is the red character
		tileType == "_";
		character = 2;
		charOn = true;
		redInit = [x,y];
	}
	
	var tileScript = tileObject.AddComponent("tile");
	
	tileScript.transform.parent = tileFolder.transform;
	tileScript.transform.position = Vector3(x,y,0);

	tileScript.init(x, y, tileType, charOn);
	
	tileScript.name = "Tile "+x+" "+y;
	tiles[y].Add(tileScript);

	
	if( tileType == "A" ) {
		blueTargets[0] = tileScript;
	} else if( tileType == "B" ) {
		blueTargets[1] = tileScript;
	} else if( tileType == "C" ) {
		blueTargets[2] = tileScript;
	} else if( tileType == "a" ) {
		redTargets[0] = tileScript;
	} else if( tileType == "b" ) {
		redTargets[1] = tileScript;
	} else if( tileType == "c" ) {
		redTargets[2] = tileScript;
	}
	
	return tileScript;
}

//collects blue targets and sets the next one up
function collectBlue() {
	blueChar.currentTile.collect(); //sets type to be wall, reverts model to blank, set collectable to be false
	curTarBlue++;
	//check to see if there are still targets left
	if(curTarBlue < blueTargets.length+1) {
	blueTargets[curTarBlue-1].makeTarget(blueTargets[curTarBlue-1].targetNum, curTarBlue); //make it into a collectable model
	}
	else {
		//completed blue targets
	}
}

//collects red targets and sets the next one up
function collectRed() {
	redChar.currentTile.collect(); //sets type to be wall, reverts model to blank, set collectable to be false
	curTarRed++;
	//check to see if there are still targets left
	if(curTarRed<redTargets.length+1) {
	redTargets[curTarRed-1].makeTarget(redTargets[curTarRed-1].targetNum, curTarRed); //make it into a collectable model
	}
	else {
		//completed red targets
	}

}