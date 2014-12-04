/*
FALL BREAK GAME MANAGER
*/

import System.IO;

var tileFolder : GameObject;				//holds tiles for hierarchy pane
var tiles : Array;							//2D array of tiles

var characterFolder : GameObject;			//holds characters for hierarchy pane
var tutorialFolder : GameObject;			//holds characters for hierarchy pane
var winFolder: GameObject;					//for easy deleting
var blueChar : character;					//blue character
var redChar : character;					//red character

var levelOver : boolean;					//determines whether the level is over (used to keep TurnCounter from incrementing after level completion)
		
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
var makeType : String;
var allBlueCollected: boolean = false;		//keeps track of whether we've collected all the blue targets
var allRedCollected:  boolean = false;		//keeps track of whether we've collected all the red targets
var reqBlueTargets : int = 0;				//number of targets require for the level, 
var reqRedTargets : int = 0;				//number of targets require for the level, 

var turns : turnCounter;					//the number of moves we've made for this level
var level : String = "Assets/Resources/Levels/level0";	//default starting level
var levelSet: int=1; 							//for which set of levels we're on (1-5), currently in groups of 5
var numLevelSets=5;								//5 sets of levels currently
var curLevel: int = 0;							//the level we're currently on
var audioSource1: AudioSource;				//controls the audio
var numLevels : int; 					//number of levels we currently have
var theStart: boolean = true;
var mainMenuCount : int = 0;
var bestStar : int;						//when level read in, set to best possible score
var okayStar : int;						//when level read in, set to medium score
var starCounts : Array;					//keeps track of players best number of stars for each level

// Called once when the script is created.
function Start () {
 //reinitialize both tile and character folders, arrays for tracking targets, set current targets to be 1	
    tileFolder = new GameObject();
	tileFolder.name = "TileFolder";
	
	characterFolder = new GameObject();
	characterFolder.name = "CharacterFolder";	

	winFolder = new GameObject();
	winFolder.name = "winFolder";

	tutorialFolder = new GameObject();
	tutorialFolder.name = "tutorialFolder";
	
	blueTargets = new Array(3);
	redTargets = new Array(3);
	
	levelOver = false;

	//print(level);
	buildMap("Assets/Resources/Levels/level0");
	//reset("level0");
	addCounter();
	addClouds();
	
	audioSource1 = gameObject.AddComponent("AudioSource");

	audioSource1.audio.loop = true; 
	audioSource1.audio.clip = Resources.Load("Sounds/loop_0");
	audioSource1.audio.Play();

}

/* takes in a string, pulls in corresponding text file, and reads in a map
 * params: map (the name of the text file for the level without .txt)
 */
 function buildMap(mapName : String) {	
 	//tutorial text 
 	if(map=="Assets/Resources/Levels/levelmenu") {
 		tutorialText(1); //normal
	 	tutorialText(2); //reverse
	 } else if(curLevel>=0&&curLevel<3) {
	 	tutorialText(3); //normal
	 	tutorialText(4); //reverse
 	}
	curTarBlue = 1;
	curTarRed = 1;
	levelSet = curLevel/numLevelSets;
	print(levelSet);

	try {
        // Create an instance of StreamReader to read from a file.
        sr = new StreamReader(mapName+".txt");
        // Read and display lines from the file until the end of the file is reached.
        
        line = sr.ReadLine();
        width = parseInt(line);
        line = sr.ReadLine();
        height = parseInt(line);
        line = sr.ReadLine();
        bestStar = parseInt(line);
        line = sr.ReadLine();
        okayStar = parseInt(line);
        var map = new Array(height);
        

        tiles = new Array(height);
        for(i=0; i<height; i++) {
        	tiles[i] = new Array(width);
        	map[i] = new Array(width);
        	row = sr.ReadLine().Split(' '[0]);
        	for(j=0; j<width; j++) {
        		map[i][j] = row[j];
        	} 
        }
        
        for(i = height - 1; i >- 1; i--) {
        	for( j = width-1; j > -1; j--) {
				addTile(j, i, map[height - i - 1][j]);
            }
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
	if (blueChar.moving || blueChar.shaking || redChar.moving || redChar.shaking || blueChar.bouncing || redChar.bouncing) {
		return;
	}
	var bluedir : int = blueChar.setTile();
	var reddir :  int = redChar.setTile();
	
	//check to see if the move is legal
	if (pitCheck() && sameSpaceCheck() && targetBlockedCheck()) {
		var bTrue = blueChar.move(bluedir);
		var rTrue = redChar.move(reddir);
		
		if(bTrue || rTrue) {
			if (!levelOver) {
				turns.addTurn();
			}
		}

		//check to see if the target we're moving onto is collectable
		if(blueChar.currentTile.model.collectable&&curTarBlue<=reqBlueTargets) {
			collectBlue();
			if(curTarBlue==curTarRed) {
				playNextLoop();			
			}
		}
		if(redChar.currentTile.model.collectable&&curTarRed<=reqRedTargets) {
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
	if (blueChar.currentTile.isPit()) {
		blueChar.pitShake();
	}
	if (redChar.currentTile.isPit()) {
		redChar.pitShake();
	}
	return (!blueChar.currentTile.isPit() && !redChar.currentTile.isPit());
}

//returns true if both characters are not moving into the same space
function sameSpaceCheck() {
	if(blueChar.currentTile==redChar.currentTile) {
		redChar.pitShake();
		blueChar.pitShake();
	}
	return blueChar.currentTile!=redChar.currentTile;
}

//returns false if either character tries to move into a target they are not allowed to collect
//just cases to make it false
function targetBlockedCheck() {
		curTar1 = blueChar.currentTile.getTargetNum();
		curTar2 = redChar.currentTile.getTargetNum();
		var wrongTarget: boolean =true; 

		if ((curTar1==0) && (curTar2==0)) {
			wrongTarget = true;
		}

//checking to see if going for wrong character's target

//if blue tries to collect red's targer, blue shakes 
	if(curTar1/10 == 2) {
		blueChar.pitShake();
		wrongTarget = false;
	}

///if red tries to collect blues's target, red
	if(curTar2/10 == 1) {
		redChar.pitShake();
		wrongTarget = false; 
 	}

//checking to see if going for wrong number target
	if (!(curTar1%10 == curTarBlue) && curTar1!=0) {
		blueChar.pitShake();
		wrongTarget = false;
	}
	if (!(curTar2%10 == curTarRed) && curTar2!=0) {
		redChar.pitShake();
		wrongTarget = false;
	}
		return wrongTarget;
	
}

//synchs up the loop so that the current one stops and the next one plays
function playNextLoop() {
	audioSource1.clip = Resources.Load("Sounds/loop_"+(levelSet*10+(curTarRed-1)));
	print("loading audio:"+(levelSet*10+(curTarRed-1)));
	audioSource1.audio.Stop();
	audioSource1.audio.Play(); 
}

//gives each tile an array containing the tiles its the E, S, W, N directions (in that order)
function setNeighbors() {
	var width = tiles[0].length - 1;
	var height = tiles.length - 1;
	for(y = 1; y < height; y++) {
		for(x = 1; x < width; x++) {
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
also changes  the required number of targets

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
	tiles[y][x] = tileScript;

	
	if( tileType == "A" ) {
		blueTargets[0] = tileScript;
		if(reqBlueTargets<1) {
			reqBlueTargets=1;
		}
	} else if( tileType == "B" ) {
		blueTargets[1] = tileScript;
		if(reqBlueTargets<2) {
			reqBlueTargets=2;
		}
	} else if( tileType == "C" ) {
		blueTargets[2] = tileScript;
		if(reqBlueTargets<3) {
			reqBlueTargets=3;
		}
	} else if( tileType == "a" ) {
		redTargets[0] = tileScript;
		if(reqRedTargets<1) {
			reqRedTargets=1;
		}
	} else if( tileType == "b" ) {
		redTargets[1] = tileScript;
		if(reqRedTargets<2) {
			reqRedTargets=2;
		}
	} else if( tileType == "c" ) {
		redTargets[2] = tileScript;
		if(reqRedTargets<3) {
			reqRedTargets=3;
		}
	}
	
	return tileScript;
}

//collects blue targets and sets the next one up
function collectBlue() {
	//Starts the spinnnnnniiiiiinnnnnnngggggggg
	blueChar.spinny();
	//sets type to be wall, reverts model to blank, set collectable to be false
	blueChar.currentTile.collect(); 
	curTarBlue++;
	//check to see if there are still targets left
	if(curTarBlue <= reqBlueTargets) {
		//make it into a collectable model
		blueTargets[curTarBlue-1].makeTarget(blueTargets[curTarBlue-1].targetNum, curTarBlue); 
	}
	else {
		//completed blue targets
		allBlueCollected=true;
			if(allRedCollected) {
				youWin();
		}
	}
}


//collects red targets and sets the next one up
function collectRed() {
	//Starts the spinnnnnniiiiiinnnnnnngggggggg
	redChar.spinny();
	redChar.currentTile.collect(); //sets type to be wall, reverts model to blank, set collectable to be false
	curTarRed++;
	//check to see if there are still targets left
	if(curTarRed <= reqRedTargets) { 
	//redTargets.length+1) {
		//make it into a collectable model
		redTargets[curTarRed-1].makeTarget(redTargets[curTarRed-1].targetNum, curTarRed); 
	}
	else {
		allRedCollected=true;
		if(allBlueCollected) {
			//beat level
				youWin();
		}
	}
}

//displays winning text
function youWin() {
	levelOver = true;
	blueChar.spinny();
	blueChar.winning = true;
	redChar.spinny();
	redChar.winning = true;
	
	//setting the star amounts
	if (turns.turns <= bestStar) {
		//right now will reset to lower num stars if score lower later
		print("three stars!!!");
		starCounts[curLevel-1] = 3;
	} else if (turns.turns <= okayStar) {
		starCounts[curLevel-1] = 2;
		print("two stars!!");
	} else {
		starCounts[curLevel-1] = 1;
		print("eh");
	}

	var winObject = new GameObject();
	var winScript = winObject.AddComponent("win");
	winScript.transform.parent = winFolder.transform;
	winScript.init(this);
	winScript.name = "win";
	winScript.transform.position = Vector3(4, 4, -2);

//winning sound 
	audioSource2 = gameObject.AddComponent("AudioSource");
	audioSource2.audio.loop = true; 
	audioSource2.audio.clip = Resources.Load("Sounds/winsound");
	audioSource2.audio.PlayOneShot(audioSource2.audio.clip ,.9);
	
		yield WaitForSeconds(audioSource2.audio.clip.length-2);				//so the next level doesn't auto load [took wayyy too long to figure out]
			curLevel++;
    		level = "Assets/Resources/Levels/level"+curLevel;
			reset(level);

}

//diaplys tutorial info in the bottom corner 1 is non-inverted 2 is inverted
//TODO: switch out map for a boolean that tells us whether or not we're on the main menu screen
function tutorialText(inversion: int) {
	var tutorialObject = new GameObject();
	var tutorialScript = tutorialObject.AddComponent("tutorial");
	tutorialScript.transform.parent = tutorialFolder.transform;
	tutorialScript.init(this,inversion);
	tutorialScript.name = "tutorial";
	
	//if(curLevel>=0&&curLevel<4) {
		if(inversion==1) {
			tutorialScript.transform.position = Vector3(2.5, 7, -2);
		}
		else if (inversion==2) {
			tutorialScript.transform.position = Vector3(2.5, 1, -2);
		}
	//}
	//else {
		if(inversion==3) {
			tutorialScript.transform.position = Vector3(-1, 4, -2);
		}
		else if(inversion==4) {
			tutorialScript.transform.position = Vector3(7.5, 4, -2);

		}
	//}
}



//clear the map (identified with a string).
function reset(map : String) {
	levelOver = false;
	var children : int = tileFolder.transform.childCount;
 		for (var i = children - 1; i >= 0; i--) {
   			Destroy(tileFolder.transform.GetChild(i).gameObject);
		}
		Destroy(blueChar.gameObject);
		Destroy(redChar.gameObject);

		if( tutorialFolder.transform.childCount>0) {
			Destroy(tutorialFolder.transform.GetChild(1).gameObject);
			Destroy(tutorialFolder.transform.GetChild(0).gameObject);
		}
		
		tiles.Clear();

		reqBlueTargets=0;
		reqRedTargets=0;
		buildMap(map);
		turns.reset();
		if(allRedCollected&&allBlueCollected) {
			Destroy(winFolder.transform.GetChild(0).gameObject);
		}
		if(reqRedTargets==0) {
			allRedCollected=true;
		}
		else {
		allRedCollected=false;
		}
		if(reqBlueTargets==0) {
			allBlueCollected=true;
		}
		else {
			allBlueCollected=false;
		}
		levelSet = curLevel/numLevelSets;
		audioSource1.audio.clip = Resources.Load("Sounds/loop_"+levelSet*10);
		audioSource1.audio.Play();
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

function addClouds() {
	var cloudObject = new GameObject();
	var cloudScript = cloudObject.AddComponent("clouds");
	
	cloudScript.transform.parent = transform;
	cloudScript.init();
	cloudScript.name = "clouds";
}
//Writes the edited level into a text file (numbered appropriately) and resets to the default level
function writeLevel() {
	var nextLevel = numLevels + 1;
	var sw : StreamWriter = new StreamWriter("Assets/Resources/Levels/level" + nextLevel + ".txt");
	var row : String = "o ";
	var realWidth = makeWidth + 2;
	var realHeight = makeHeight + 2;
	sw.WriteLine(realWidth);
	sw.WriteLine(realHeight);
	for (var k = 1; k < realWidth; k++) {
		row = row + "o ";
	}
	sw.WriteLine(row);
	row = "o ";
	for (var i = 0; i < makeHeight; i++) {
		for (var j = 0; j < makeWidth; j++) {
			row = row + tiles[j][i].getType() + " ";
		}
		sw.WriteLine(row + "o");
		row = "o ";
	}
	for (var kk = 1; kk < realWidth; kk++) {
		row = row + "o ";
	}
	sw.WriteLine(row);
	sw.Flush();
	sw.Close();
	numLevels++;
	editMode = false;
	reset("Assets/Resources/Levels/level0");
}

//Level select
//TODO: set up main menu SCREEN
//TODO streamline level loading based on name
function OnGUI () {
	var xOffset : int=50;
    var yOffset : int=260;
    var buttonHeight: int= 60;
    var buttonWidth: int =100;
    var offset: int =90;
    numLevels = 32; 	//number of levels we currently have (0 indexed)
    starCounts = new Array(numLevels);
    var numPerRow: int = 4;
  	//var numButtons: int=5;
  	makeLevel=false;

    //x, y, width, height
 /*
(0,0) (0,1) (0,2) (0,3)
(1,0) (1,1) (1,2) (1,3)
(2,0) (2,1) (2,2) (2,3)
 */
 /*
 	if (theStart) {
 		if (GUI.Button (Rect (415, 210, 100, 60), "play") ) {
				reset("Assets/Resources/Levels/level0");
		theStart=false;
		}	//	Destroy(this);
	}
	*/
    if(mainMenu) {
    	if (mainMenuCount == 0) {
    		theStart = false;
    		mainMenuCount++;
    	}
    	var count: int;
    	for(county = 0; county<numLevels/numPerRow; county++) {
    		for(countx = 0; countx<numPerRow; countx++) {
			   	if (GUI.Button (Rect (0+(buttonWidth*countx), 0+(buttonHeight*county), buttonWidth, buttonHeight), "Level "+ ((numPerRow*county)+countx))) {
			            mainMenu=false;
			            curLevel=numPerRow*county+countx;
			            level = "Assets/Resources/Levels/level"+((numPerRow*county)+countx);
			            levelSet=curLevel/numLevelSets;
			            reset(level);

			    }
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
			for (var ii = 0; ii < makeWidth; ii++) {
				for (var j = 0; j < makeHeight; j++) {
					tiles[ii][j].makeEditable();
				}
			}
		}
	} else if(editMode) {
		if (GUI.Button (Rect (10, 0, buttonWidth, buttonHeight), "Wall")) {
            makeType="x";
     	} 
      	if (GUI.Button (Rect (10, 50, buttonWidth, buttonHeight), "Pit")) {
			makeType="o";
		}
     	if (GUI.Button (Rect (10, 100, buttonWidth, buttonHeight), "Red Char")) {
     		makeType="2";
     	}
		if (GUI.Button (Rect (10, 150, buttonWidth, buttonHeight), "Red *")) {
			makeType="a";
     	} 
      	if (GUI.Button (Rect (10, 200, buttonWidth, buttonHeight), "Red **")) {
			makeType="b";
		}
     	if (GUI.Button (Rect (10, 250, buttonWidth, buttonHeight), "Red ***")) {
			makeType="c";     		
     	}
		if (GUI.Button (Rect (10, 300, buttonWidth, buttonHeight), "Blue Char")) {
     		makeType="1";
     	}
		if (GUI.Button (Rect (10, 350, buttonWidth, buttonHeight), "Blue *")) {
			makeType="A";		
     	} 
      	if (GUI.Button (Rect (10, 400, buttonWidth, buttonHeight), "Blue **")) {
			makeType="B";		
		}
     	if (GUI.Button (Rect (10, 450, buttonWidth, buttonHeight), "Blue ***")) {
			makeType="C";     		
     	}
     	if (GUI.Button (Rect (10, 500, buttonWidth, buttonHeight), "Empty Tile")) {
			makeType="_";     		
     	}
     	if (GUI.Button (Rect (10, 550, buttonWidth, buttonHeight), "Write Level")) {
     		writeLevel();
     		editMode=false;
     	}  	
    } else {
    	if (GUI.Button (Rect (10, 0, buttonWidth, buttonHeight), "Main Menu")) {
            mainMenu=true;
     	} 
     	
      	if (GUI.Button (Rect (10, buttonHeight, buttonWidth, buttonHeight), "Reset")) {
			reset(level);
		}
     	
     	// if (GUI.Button (Rect (10, 2*buttonHeight, buttonWidth, buttonHeight), "Make Level")) {
     	// 	makeLevel = true;
     	// }
    }
}




