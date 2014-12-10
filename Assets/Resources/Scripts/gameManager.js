/*
FALL BREAK GAME MANAGER
*/

//TODO display current level number

import System.IO;

var tileFolder : GameObject;				//holds tiles for hierarchy pane
var tiles : Array;							//2D array of tiles
var starFolder : GameObject;
var stars : Array;

var characterFolder : GameObject;			//holds characters for hierarchy pane
var tutorialFolder : GameObject;
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
var makeWidth = 2;
var makeHeight = 2;	
var editMode : boolean = false;
var makeType : String;
var allBlueCollected: boolean = false;		//keeps track of whether we've collected all the blue targets
var allRedCollected:  boolean = false;		//keeps track of whether we've collected all the red targets
var reqBlueTargets : int = 0;				//number of targets require for the level, 
var reqRedTargets : int = 0;				//number of targets require for the level, 

var levelDis : levelDisplay;
var turns : turnCounter;					//the number of moves we've made for this level
var level : String = "Assets/Resources/Levels/level0";	//default starting level
var levelSet: int = 1; 							//for which set of levels we're on (1-5), currently in groups of 5
var numLevelSets = 5;								//5 sets of levels currently
var curLevel: int = 0;							//the level we're currently on
var audioSource1: AudioSource;				//controls the audio
var numLevels : int; 					//number of levels we currently have
var theStart: boolean = true;
var mainMenuCount : int = 0;
var bestStar : int;						//when level read in, set to best possible score
var okayStar : int;						//when level read in, set to medium score
var starCounts : Array;					//keeps track of players best number of stars for each level
var help: boolean;						//displays help text when true

// Called once when the script is created.
function Start () {
 //reinitialize both tile and character folders, arrays for tracking targets, set current targets to be 1	
    tileFolder = new GameObject();
	tileFolder.name = "TileFolder";
	
	characterFolder = new GameObject();
	characterFolder.name = "CharacterFolder";	

	tutorialFolder = new GameObject();
	tutorialFolder.name = "tutorialFolder";	

	winFolder = new GameObject();
	winFolder.name = "winFolder";
	
	starFolder = new GameObject();
	starFolder.name = "starFolder";
	stars = new Array(3);
	
	blueTargets = new Array(3);
	redTargets = new Array(3);
	
	levelOver = false;

	//print(level);
	buildMap("Assets/Resources/Levels/level0");
	addStar(1);
	addStar(2);
	addStar(3);
	levelDisplay();
	addCounter();
	addClouds();
	
	audioSource1 = gameObject.AddComponent("AudioSource");

	audioSource1.audio.loop = true; 
	audioSource1.audio.clip = Resources.Load("Sounds/loop_0");
	audioSource1.audio.Play();

	// attach script to reset button
	var resetObject = GameObject.Find("resetButton");
	var resetScript = resetObject.AddComponent(resetButtonMouse);
	resetScript.init(this);
	
	// attach script to menu button
	var menuObject = GameObject.Find("menuButton");
	var menuScript = menuObject.AddComponent(menuButtonMouse);
	menuScript.init(this);
	
	// attach script to help button
	var helpObject = GameObject.Find("helpButton");
	var helpScript = helpObject.AddComponent(helpButtonMouse);
	helpScript.init(this);

	// attach script to mute button
	var muteObject = GameObject.Find("muteButton");
	var muteScript = muteObject.AddComponent(muteButtonMouse);
	muteScript.init(this);
	numLevels = 52;

	starCounts = new Array(numLevels);
	for(var starsI = 0; starsI<numLevels;starsI++) {
		starCounts[starsI] = 0;
	}
}

/* takes in a string, pulls in corresponding text file, and reads in a map
 * params: map (the name of the text file for the level without .txt)
 */
 function buildMap(mapName : String) {	
	curTarBlue = 1;
	curTarRed = 1;
	levelSet = curLevel/numLevelSets;
	//print(levelSet);

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

function  loadingTiles() {
	if (tiles[0][0]) {
		return tiles[0][0].moving();
	}
	else {
		return true;
	}
}

function Update () {
	if (turns.turns > bestStar && turns.turns < okayStar) { //if greater than best # but less than okay
		print("hi");
		if (!stars[2].falling || !stars[2].fallen) {
			stars[2].Drop();
		}
	} else if (turns.turns > okayStar) { //if greater than okay
		if (!stars[1].falling || !stars[1].fallen) {
			stars[1].Drop();
		}
	}
	
	if (blueChar.moving || blueChar.shaking || redChar.moving || redChar.shaking || blueChar.bouncing || redChar.bouncing || loadingTiles()) {
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
	if(Input.GetKeyDown("space")) {
		tutorialText(1);
  		tutorialText(2);
	}
	if (Input.GetKeyUp("space")) {
		Destroy(tutorialFolder.transform.GetChild(0).gameObject);
		Destroy(tutorialFolder.transform.GetChild(1).gameObject);
	}
//deigned to only happen once each. 0 is the left star 2 is the rightmost
	if (turns.turns > bestStar) {
//		if(!stars[2].startFalling) {
			stars[2].Drop();
//		}
	} 
	if (turns.turns > okayStar) {
//		if(!stars[0].startFalling) {
			stars[0].Drop();
//		}
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
	//print("loading audio:"+(levelSet*10+(curTarRed-1)));
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

function addStar(starNum : int) {
	var starObject = new GameObject.CreatePrimitive(PrimitiveType.Quad);
	var starScript = starObject.AddComponent("stars");

	starScript.transform.parent = starFolder.transform;
	
	starScript.init(this, starNum);
	starScript.name = "Star " + starNum;
	stars[starNum - 1] = starScript;
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
	//	print("three stars!!!");
		starCounts[curLevel] = 3;
	//	print(starCounts[curLevel]);
	} else if (turns.turns <= okayStar) {
		starCounts[curLevel] = 2;
	//	print("two stars!!");
	} else {
		starCounts[curLevel] = 1;
//		print("eh");
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
	audioSource2.mute = audioSource1.mute;
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
	//tutorialScript.init(this,inversion);
	tutorialScript.name = "tutorial";
	
	//else {
		if(inversion==1) {
			var blueButtons = Instantiate(Resources.Load("Prefabs/blueDirections", GameObject)) as GameObject;
			blueButtons.transform.parent = tutorialScript.gameObject.transform;
			blueButtons.transform.position = Vector3(blueChar.transform.position.x,blueChar.transform.position.y,-.001);//, characterFolder[1], -0.001);
			//tutorialScript.transform.position = Vector3(-1, 4, -2);
		}
		else if(inversion==2) {
			var purpleButtons = Instantiate(Resources.Load("Prefabs/purpleDirections", GameObject)) as GameObject;
			purpleButtons.transform.parent = tutorialScript.gameObject.transform;
			purpleButtons.transform.position = Vector3(redChar.transform.position.x,redChar.transform.position.y,-.001);
			//tutorialScript.transform.position = Vector3(7.5, 4, -2);

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
		//clear out old stars
				
		var starsToDestroy : int = starFolder.transform.childCount;
		for (i = starsToDestroy - 1; i >= 0; i--) {
			Destroy(starFolder.transform.GetChild(i).gameObject);
		}
		addStar(1);
		addStar(2);
		addStar(3);

		levelDis.changeLevel(curLevel);
}

function reset() {
	reset(level);
}

function makeTile (x : int, y : int, tileType : String) {
	var tileObject = new GameObject();
	var charOn = false;
	var character = 0;
	
	var tileScript = tileObject.AddComponent("tile");
	
	tileScript.transform.parent = tileFolder.transform;
	tileScript.transform.position = Vector3(x,y,-1);

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

function levelDisplay() {
	var levelDisplayObject = new GameObject();
	var levelDisplayScript = levelDisplayObject.AddComponent("levelDisplay");
	
	levelDisplayScript.transform.parent = transform;
	levelDisplayScript.transform.position = Vector3(Screen.width/4, Screen.height*7/8, -2);
	
	levelDisplayScript.init(this, curLevel);
	
	levelDis = levelDisplayScript;
	levelDisplayScript.name = "levelDisplay";
}

function addCounter() {
	var countObject = new GameObject();
	var countScript = countObject.AddComponent("turnCounter");
	
	countScript.transform.parent = transform;
	countScript.transform.position = Vector3(11, 8, -2);

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

//Level select
//TODO: set up main menu SCREEN
//TODO streamline level loading based on name
function OnGUI () {
    var buttonHeight: int= Screen.width/20;
    var buttonWidth: int =Screen.width/14;
    numLevels = 52; 	//number of levels we currently have (0 indexed)
    var numPerRow: int = 5;
  	//var numButtons: int=5;

    //x, y, width, height
 /*
(0,0) (0,1) (0,2) (0,3)
(1,0) (1,1) (1,2) (1,3)
(2,0) (2,1) (2,2) (2,3)
 */
    if(mainMenu) {
    	if (mainMenuCount == 0) {
    		theStart = false;
    		mainMenuCount++;
    	}
    	var count: int;
    	for(county = 0; county<numLevels/numPerRow; county++) {
    		for(countx = 0; countx<numPerRow; countx++) {
			   	if (GUI.Button (Rect (0+(buttonWidth*countx), 0+(buttonHeight*county), buttonWidth-numLevels/2, buttonHeight-numLevels/2), "Level "+ ((numPerRow*county)+countx))) {
			            mainMenu=false;
			            curLevel=numPerRow*county+countx;
			            level = "Assets/Resources/Levels/level"+((numPerRow*county)+countx);
			            levelSet=curLevel/numLevelSets;
			            reset(level);

			    }
    		}
    	}
    }/*else if(help) {
        var textHeight:int =30;
  		var textWidth:int = 300;
    	 // Make a group on the center of the screen
    GUI.BeginGroup (Rect (Screen.width / 2 -textWidth/2, Screen.height / 2 -textHeight/2, buttonWidth*5, buttonHeight*5));
    // All rectangles are now adjusted to the group. (0,0) is the topleft corner of the group.

	    // We'll make a box so you can see where the group is on-screen.
	    GUI.Box(new Rect(10,textHeight,textWidth,textHeight), "Characters move opposite each other");
		GUI.Box(new Rect(10,textHeight*2,textWidth,textHeight), "You control purple");
		GUI.Box(new Rect(10,textHeight*3,textWidth,textHeight), "Arrow Keys or wasd");
		GUI.Box(new Rect(10,textHeight*4,textWidth,textHeight), "Don't fall into the clouds");
		GUI.Box(new Rect(10,textHeight*5,textWidth,textHeight), "Press space to dispaly next move");
		GUI.Box(new Rect(10,textHeight*6,textWidth,textHeight), "Collect targets in order, but don't be greedy");
	    
	    	if(GUI.Button (Rect (10+textWidth/4, textHeight*7, textWidth/2, buttonHeight),"Close")) {
	    		help=false;
	    	}
    // End the group we started above. This is very important to remember!
    GUI.EndGroup ();
    }*/ 
}




