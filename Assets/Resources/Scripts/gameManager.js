﻿/*
FALL BREAK GAME MANAGER
*/

import System.IO;

var tileFolder : GameObject;				//holds tiles for hierarchy pane
var tiles : Array;							//2D array of tiles

var characterFolder : GameObject;			//holds characters for hierarchy pane
var blueChar : character;					//blue character
var redChar : character;					//red character
		
var curTarBlue : int = 1; 					//default starting target number is one
var curTarRed : int = 1; 					//default starting target number is one
var redTargets: Array; 						//array for holding the tile objects of redTargets
var blueTargets: Array;  					//array for holding the tile objects of the blue targets
var blueInit : Array;						//initial x and y for blue's placement
var redInit : Array;						//initial x and y for reds placement			
var mainMenu : boolean;						//whether we're on the main menu screen
//EDITOR SCHTUFF
var makeLevel : boolean;
var makeWidth = 2;
var makeHeight = 2;	
var editMode : boolean = false;
var makeType : String = "_";

var turns : turnCounter;					//the number of moves we've made for this level
var level : String = "Assets/Resources/Levels/level1";	//default starting level
var audioSource1: AudioSource;				//controls the audio
var numLevels : int = 7; 					//number of levels we currently have

// Called once when the script is created.
function Start () {

	buildMap(level);
	addCounter();
	audioSource1 = gameObject.AddComponent("AudioSource");

	audioSource1.audio.loop = true; 
	audioSource1.audio.clip = Resources.Load("Sounds/loop1");
	audioSource1.audio.Play();
}

/* takes in a string, pulls in corresponding text file, and reads in a map
 * params: map (the name of the text file for the level without .txt)
 */
 function buildMap(map : String) {	

 //reinitialize both tile and character folders, arrays for tracking targets, set current targets to be 1	
    tileFolder = new GameObject();
	tileFolder.name = "TileFolder";
	
	characterFolder = new GameObject();
	characterFolder.name = "CharacterFolder";
	
	blueTargets = new Array(3);
	redTargets = new Array(3);
	curTarBlue = 1;
	curTarRed = 1;

	try {
        // Create an instance of StreamReader to read from a file.
        print(map);
        sr = new StreamReader(map+".txt");
        // Read and display lines from the file until the end of the file is reached.
        line = sr.ReadLine();
        width = parseInt(line);
        line = sr.ReadLine();
        height = parseInt(line);
        tiles = new Array();
        line = sr.ReadLine();
        y=height-1;
        while (line != null) {
        	tiles[y] = new Array();
            row = line.Split(' '[0]);
            for( x = 0; x < width; x++) {
				addTile(x, y, row[x]);
            }
            line = sr.ReadLine();
            y--;
        }
        sr.Close();
        
        //after tiles are set up, add characters and set their neighbors
        blueChar = addCharacter(blueInit[0], blueInit[1], 0, 1);
		redChar = addCharacter(redInit[0], redInit[1], 0, 2);
		setNeighbors();
    }
    catch (e) {
        // Let the user know what went wrong.
        print("The level text file could not be read:");
        print(e.Message);
    }

}

function Update () {
	blueChar.setTile();
	redChar.setTile();
	
	//check to see if the move is legal
	if (pitCheck() && sameSpaceCheck() && targetBlockedCheck()) {
		var bTrue = blueChar.move();
		var rTrue = redChar.move();
		
		if(bTrue || rTrue) {
			turns.addTurn();
		}

		//check to see if the target we're moving onto is collectable
		if(blueChar.currentTile.model.collectable) {
			collectBlue();
			if(curTarBlue==curTarRed) {
				playNextLoop();			
			}
		}
		if(redChar.currentTile.model.collectable) {
			collectRed();
			if(curTarBlue==curTarRed) {
				playNextLoop();
			}
		}
	}
	//if the move wasn't legal, do not move.
	else {
		blueChar.pitReset();
		redChar.pitReset();
	}
	
	if (editMode) {
		for(var i = 0; i < makeWidth; i++) {
			for(var j = 0; j < makeHeight; j++) {
				tiles[i][j].tempType = makeType;
			}
		}
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

//checking to see if going for wrong character's target
	if((curTar1/10 == 2) || curTar2/10 == 1) {
		return false; 
 	}

//checking to see if going for wrong number target
	if (!(curTar1%10 == curTarBlue) && curTar1!=0) {
		return false;
	}
	if (!(curTar2%10 == curTarRed) && curTar2!=0) {
		return false;
	}
		return true;
	
}

//synchs up the loop so that the current one stops and the next one plays
function playNextLoop() {
	audioSource1.clip = Resources.Load("Sounds/loop"+(curTarRed-1));
	audioSource1.audio.Stop();
	audioSource1.audio.Play(); 
}

//gives each tile an array containing the tiles its the E, S, W, N directions (in that order)
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
	//sets type to be wall, reverts model to blank, set collectable to be false
	blueChar.currentTile.collect(); 
	curTarBlue++;
	//check to see if there are still targets left
	if(curTarBlue < blueTargets.length+1) {
		//make it into a collectable model
		blueTargets[curTarBlue-1].makeTarget(blueTargets[curTarBlue-1].targetNum, curTarBlue); 
	}
	else {
		//TO DO: write the win condition.
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
		//TO DO: set up win condition
		//blue will check red, red checks blue, then if all is well call winFunction.
		//completed red targets
	}
}

//clear the map (identified with a string).
function reset(map : String) {
	var children : int = tileFolder.transform.childCount;
 		for (var i = children - 1; i >= 0; i--) {
   			Destroy(tileFolder.transform.GetChild(i).gameObject);
		}
		Destroy(blueChar.gameObject);
		Destroy(redChar.gameObject);
		tiles.Clear();
		buildMap(map);
		turns.reset();
}

function makeTile (x : int, y : int, tileType : String) {
	var tileObject = new GameObject();
	var charOn = false;
	var character = 0;
	
	var tileScript = tileObject.AddComponent("tile");
	
	tileScript.transform.parent = tileFolder.transform;
	tileScript.transform.position = Vector3(x,y,0);

	tileScript.init(x, y, tileType, charOn);
	
	tileScript.name = "Tile " + x + " " + y;
	return tileScript;
}

function convertTile(x : int, y : int, tileType : String) {
	tiles[x][y].type = tileType;
	print(tiles[x][y].type);
}

function displayLevel(makeWidth : int, makeHeight : int) {
	var children : int = tileFolder.transform.childCount;
 	for (var i = children - 1; i >= 0; i--) {
   		Destroy(tileFolder.transform.GetChild(i).gameObject);
	}
	Destroy(blueChar.gameObject);
	Destroy(redChar.gameObject);
	tiles.Clear();
	
	tiles = new Array();
	tileFolder = new GameObject();
	tileFolder.name = "TileFolder";
	for (var ii = 0; ii < makeWidth; ii++) {
		tiles[ii] = new Array();
		for (var j = 0; j < makeHeight; j++) {
			tiles[ii].Add(makeTile(ii, makeHeight-j, "_"));
		}
	}
}

function addCounter() {
	var countObject = new GameObject();
	var countScript = countObject.AddComponent("turnCounter");
	
	countScript.transform.parent = transform;
	countScript.transform.position = Vector3(-2, 1, -2);

	countScript.init(this);
	
	turns = countScript;
	countScript.name = "turnCounter";
}

//Level select
//TODO: set up main menu SCREEN
//TODO streamline level loading based on name
function OnGUI () {
	var xOffset : int=50;
    var yOffset : int=260;
    var buttonHeight: int= 100;
    var buttonWidth: int =50;
    var offset: int =100;
  	//var numButtons: int=5;

    //x, y, width, height
    if(mainMenu) {
    	var count: int;
    	for(count=1; count<=numLevels;count++) {
		   	if (GUI.Button (Rect (xOffset+(offset*count), yOffset, xOffset*2, 50), "Level "+count)) {
		            mainMenu=false;
		            level = "Assets/Resources/Levels/level"+count;
		            reset(level);
		    }
    	}
    } else if(makeLevel) {
		GUI.Label (Rect (10, 100, 50, 50), "Width");
		GUI.Label (Rect (10, 200, 50, 50), "Height");
		GUI.Label (Rect (140, 100, 50, 50), makeWidth.ToString());
		GUI.Label (Rect (140, 200, 50, 50), makeHeight.ToString());
		if (GUI.Button (Rect (90, 80, 30, 30), "+") && makeWidth < 12) {
			makeWidth++;	
		}
		if (GUI.Button (Rect (90, 110, 30, 30), "-") && makeWidth > 2) {	
			makeWidth--;
		}
		if (GUI.Button (Rect (90, 180, 30, 30), "+") && makeHeight < 12) {	
			makeHeight++;
		}
		if (GUI.Button (Rect (90, 210, 30, 30), "-") && makeHeight > 2) {	
			makeHeight--;
		}
		if (GUI.Button (Rect (10, 300, 100, 50), "MAKE MAP")) {	
			displayLevel(makeWidth, makeHeight);
			makeLevel = false;
			editMode = true;
		}
	} else if(editMode) {
		if (GUI.Button (Rect (10, 0, buttonHeight, buttonWidth), "Wall")) {
            makeType="x";
     	} 
      	if (GUI.Button (Rect (10, 50, buttonHeight, buttonWidth), "Pit")) {
			makeType="o";
		}
     	if (GUI.Button (Rect (10, 100, buttonHeight, buttonWidth), "Red Char")) {
     		makeType="2";
     	}
		if (GUI.Button (Rect (10, 150, buttonHeight, buttonWidth), "Red *")) {
			makeType="a";
     	} 
      	if (GUI.Button (Rect (10, 200, buttonHeight, buttonWidth), "Red **")) {
			makeType="b";
		}
     	if (GUI.Button (Rect (10, 250, buttonHeight, buttonWidth), "Red ***")) {
			makeType="c";     		
     	}
		if (GUI.Button (Rect (10, 300, buttonHeight, buttonWidth), "Blue Char")) {
     		makeType="1";
     	}
		if (GUI.Button (Rect (10, 350, buttonHeight, buttonWidth), "Blue *")) {
			makeType="A";		
     	} 
      	if (GUI.Button (Rect (10, 400, buttonHeight, buttonWidth), "Blue **")) {
			makeType="B";		
		}
     	if (GUI.Button (Rect (10, 450, buttonHeight, buttonWidth), "Blue ***")) {
			makeType="C";     		
     	}
     	if (GUI.Button (Rect (10, 500, buttonHeight, buttonWidth), "Empty Tile")) {
			makeType="_";     		
     	}  	
    } else {
    	if (GUI.Button (Rect (10, 0, buttonHeight, buttonWidth), "Main Menu")) {
            mainMenu=true;
     	} 
     	
      	if (GUI.Button (Rect (10, 50, buttonHeight, buttonWidth), "Reset")) {
			reset(level);
		}
     	
     	if (GUI.Button (Rect (10, 100, buttonHeight, buttonWidth), "Make Level")) {
     		makeLevel = true;
     	}
    }
}




