import System.IO;

var tileFolder : GameObject;				//holds tiles for hierarchy pane
var tiles : Array;							//2D array of tiles
var starFolder : GameObject;
var stars : Array;

var characterFolder : GameObject;			//holds characters for hierarchy pane
var tutorialFolder : GameObject;

var invalidSound 	   : GameObject;				//for holding invalid sounds
var collectSoundPurple : GameObject;						//for holding Purple collection sound
var	collectSoundGreen  : GameObject;						//for holding Green collection sound 
var winSound 		   : GameObject;

var winFolder: GameObject;					//for easy deleting
var GreenChar : character;					//Green character
var PurpleChar : character;					//Purple character

var levelOver : boolean;					//determines whether the level is over (used to keep TurnCounter from incrementing after level completion)
		
var curTarGreen : int = 1; 					//default starting target number is one
var curTarPurple : int = 1; 					//default starting target number is one
var PurpleTargets: Array; 						//array for holding the tile objects of PurpleTargets
var GreenTargets: Array;  					//array for holding the tile objects of the Green targets
var GreenInit : Array;						//initial x and y for Green's placement
var PurpleInit : Array;						//initial x and y for Purples placement			
var mainMenu : boolean;						//whether we're on the main menu screen

//EDITOR SCHTUFF
var makeWidth = 2;
var makeHeight = 2;	
var editMode : boolean = false;
var makeType : String;
var allGreenCollected: boolean = false;		//keeps track of whether we've collected all the Green targets
var allPurpleCollected:  boolean = false;		//keeps track of whether we've collected all the Purple targets
var reqGreenTargets : int = 0;				//number of targets require for the level, 
var reqPurpleTargets : int = 0;				//number of targets require for the level, 

var levelDis : levelDisplay;
var turns : turnCounter;					//the number of moves we've made for this level
var level : String = "Assets/Resources/Levels/level0";	//default starting level
var levelSet: int = 1; 							//for which set of levels we're on (1-5), currently in groups of 5
var numLevelSets = 10;								//5 sets of levels currently
var curLevel: int = 0;							//the level we're currently on
var audioSource1: AudioSource;				//controls the audio or songs
var audioSourceInvalid: AudioSource;		//controls invalid moves
var numLevels : int; 					//number of levels we currently have
var theStart: boolean = true;
var mainMenuCount : int = 0;
var bestStar : int;						//when level read in, set to best possible score
var okayStar : int;						//when level read in, set to medium score
var starCounts : Array;					//keeps track of players best number of stars for each level
var help: boolean;						//displays help text when true
var cameraObject: GameObject;

// Called once when the script is created.
function Start () {
	// if there is not already a currentLevel object, make one (only applies when not running form build)
	var cL = GameObject.Find("currentLevel");
	if(cL == null) {
		makeCurLevel();
		level = "Assets/Resources/Levels/level0";
	} else {
		level = "Assets/Resources/Levels/level"+cL.GetComponent("currentLevel").curLevel;
		curLevel=cL.GetComponent("currentLevel").curLevel;
	}
 
	stars = new Array(3);
	
	GreenTargets = new Array(3);
	PurpleTargets = new Array(3);
	
	initializeFolders();
	initializeSoundEffects();

	levelOver = false;
	buildMap(level);
	addStar(1);
	addStar(2);
	addStar(3);
	levelDisplay();
	addCounter();
	addClouds();
	
	makeButtons();
	audioSource1 = gameObject.AddComponent("AudioSource");

	audioSource1.audio.loop = true; 
	audioSource1.audio.clip = Resources.Load("Sounds/loop_0");
	audioSource1.audio.Play();

	numLevels = 52;

	starCounts = new Array(numLevels);
	for(var starsI = 0; starsI<numLevels;starsI++) {
		starCounts[starsI] = 0;
	}
}

function initializeFolders() {
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
}


function initializeSoundEffects() {
	invalidSound = new GameObject();
	invalidSound.name = "invalidSound";
	collectSoundPurple = new GameObject();
	collectSoundPurple.name = "collectPurpleSound";
	collectSoundGreen = new GameObject();
	collectSoundGreen.name = "collectGreenSound";
	winSound = new GameObject();
	winSound.name = "winsound";
}

private function makeCurLevel() {
	var levelObject = GameObject();
	var levelScript = levelObject.AddComponent("currentLevel");

	levelScript.name = "currentLevel";
}

/* takes in a string, pulls in corresponding text file, and reads in a map
 * params: map (the name of the text file for the level without .txt)
 */
 function buildMap(mapName : String) {	
	curTarGreen = 1;
	curTarPurple = 1;
	levelSet = curLevel/numLevelSets;
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
        GreenChar = addCharacter(GreenInit[0], GreenInit[1], 0, 1);
		PurpleChar = addCharacter(PurpleInit[0], PurpleInit[1], 0, 2);
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
	} else {
		return true;
	}
}

function Update () {
	if (turns.turns == bestStar - 3) {
		stars[2].wiggle();
	} else if (turns.turns == okayStar - 3) {
		stars[0].wiggle();
	} else if (turns.turns > bestStar && turns.turns < okayStar) { //if greater than best # but less than okay
		if (!stars[2].falling || !stars[2].fallen) {
			stars[2].Drop();
		}
	} else if (turns.turns > okayStar) { //if greater than okay
		if (!stars[0].falling || !stars[0].fallen) {
			stars[0].Drop();
		}
	}
	
	if (GreenChar.moving || GreenChar.shaking || PurpleChar.moving || PurpleChar.shaking || GreenChar.bouncing || PurpleChar.bouncing || loadingTiles()) {
		return;
	}
	var Greendir : int = GreenChar.setTile();
	var Purpledir :  int = PurpleChar.setTile();
	
	//check to see if the move is legal
	if (pitCheck() && sameSpaceCheck() && targetBlockedCheck()) {
		var bTrue = GreenChar.move(Greendir);
		var rTrue = PurpleChar.move(Purpledir);
		
		if(bTrue || rTrue) {
			if (!levelOver) {
				turns.addTurn();
			}
		}

		//check to see if the target we're moving onto is collectable
		if(GreenChar.currentTile.model.collectable&&curTarGreen<=reqGreenTargets) {
			collectGreen();
			if(curTarGreen==curTarPurple) {
				playNextLoop();			
			}
		}
		if(PurpleChar.currentTile.model.collectable&&curTarPurple<=reqPurpleTargets) {
			collectPurple();
			if(curTarGreen==curTarPurple) {
				playNextLoop();
			}
		}
	}
	//if the move wasn't legal, do not move.
	else {
		GreenChar.pitReset();
		PurpleChar.pitReset();
	}
	
	if (editMode) {
		for(var i = 0; i < makeWidth; i++) {
			for(var j = 0; j < makeHeight; j++) {
				tiles[i][j].tempType = makeType;
			}
		}
	}
	if(Input.GetKeyDown("space")) {
		showMoveText(1);
  		showMoveText(2);
	}
	if (Input.GetKeyUp("space")) {
		Destroy(tutorialFolder.transform.GetChild(0).gameObject);
		Destroy(tutorialFolder.transform.GetChild(1).gameObject);
	}
} 

//an attempt to get buttons to show up upon loading
function makeButtons() {
	// attach script to reset button
	var resetObject = GameObject.CreatePrimitive(PrimitiveType.Quad);
	var resetScript = resetObject.AddComponent(resetButtonMouse);
	resetScript.init(this);
	
	// attach script to menu button
	var menuObject = GameObject.CreatePrimitive(PrimitiveType.Quad);
	var menuScript = menuObject.AddComponent(menuButtonMouse);
	menuScript.init(this);
	
	// attach script to help button
	var helpObject = GameObject.CreatePrimitive(PrimitiveType.Quad);
	var helpScript = helpObject.AddComponent(helpButtonMouse);
	helpScript.init(this);

	// attach script to mute button
	var muteObject = GameObject.CreatePrimitive(PrimitiveType.Quad);
	var muteScript = muteObject.AddComponent(muteButtonMouse);
	muteScript.init(this);

	var tempheight: int =Screen.height/500;
		menuObject.transform.position = Vector3(-2, 7, 0);
		resetObject.transform.position = Vector3(-2, 6, 0);
		muteObject.transform.position = Vector3(-2, 5, 0);
		helpObject.transform.position = Vector3(-2, 4, 0);
}

//returns true if both characters are not moving into pits
function pitCheck() {
	if (GreenChar.currentTile.isPit()) {
		GreenChar.pitShake();
		audioSourceInvalid = invalidSound.AddComponent("AudioSource");
		audioSourceInvalid.audio.clip = Resources.Load("Sounds/invalid_move_2");
		audioSourceInvalid.audio.PlayOneShot(audioSourceInvalid.audio.clip ,.9);
	}
	if (PurpleChar.currentTile.isPit()) {
		PurpleChar.pitShake();
		audioSourceInvalid = invalidSound.AddComponent("AudioSource");
		audioSourceInvalid.audio.clip = Resources.Load("Sounds/invalid_move_2");
		audioSourceInvalid.audio.PlayOneShot(audioSourceInvalid.audio.clip ,.9);
	}
	return (!GreenChar.currentTile.isPit() && !PurpleChar.currentTile.isPit());
}

//returns true if both characters are not moving into the same space
function sameSpaceCheck() {
	if(GreenChar.currentTile==PurpleChar.currentTile) {
		PurpleChar.pitShake();
		GreenChar.pitShake();
		audioSourceInvalid = invalidSound.AddComponent("AudioSource");
		audioSourceInvalid.audio.clip = Resources.Load("Sounds/invalid_move_2");
		audioSourceInvalid.audio.PlayOneShot(audioSourceInvalid.audio.clip ,.9);
	}
	return GreenChar.currentTile!=PurpleChar.currentTile;
}

//returns false if either character tries to move into a target they are not allowed to collect
//just cases to make it false
function targetBlockedCheck() {
		curTar1 = GreenChar.currentTile.getTargetNum();
		curTar2 = PurpleChar.currentTile.getTargetNum();
		var wrongTarget: boolean =true; 

		if ((curTar1==0) && (curTar2==0)) {
			wrongTarget = true;
		}

//checking to see if going for wrong character's target

//if Green tries to collect Purple's targer, Green shakes 
	if(curTar1/10 == 2) {
		GreenChar.pitShake();
		wrongTarget = false;
	}

///if Purple tries to collect Greens's target, Purple
	if(curTar2/10 == 1) {
		PurpleChar.pitShake();
		wrongTarget = false; 
 	}

//checking to see if going for wrong number target
	if (!(curTar1%10 == curTarGreen) && curTar1!=0) {
		GreenChar.pitShake();
		wrongTarget = false;
	}
	if (!(curTar2%10 == curTarPurple) && curTar2!=0) {
		PurpleChar.pitShake();
		wrongTarget = false;
	}
//play sound if false
	if(wrongTarget==false) {
		audioSourceInvalid = invalidSound.AddComponent("AudioSource");
		audioSourceInvalid.audio.clip = Resources.Load("Sounds/invalid_move_2");
		audioSourceInvalid.audio.PlayOneShot(audioSourceInvalid.audio.clip ,.9);
	}
	return wrongTarget;	
}

//synchs up the loop so that the current one stops and the next one plays
function playNextLoop() {
	audioSource1.clip = Resources.Load("Sounds/loop_"+(levelSet*10+(curTarPurple-1)));
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
also changes  the requiPurple number of targets

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
	if( tileType == "1" ) {				// if it is the Green characer
		tileType == "_";
		character = 1;
		charOn = true;
		GreenInit = [x,y];
	} else if( tileType == "2" ) { 		// if it is the Purple character
		tileType == "_";
		character = 2;
		charOn = true;
		PurpleInit = [x,y];
	}
	
	var tileScript = tileObject.AddComponent("tile");
	
	tileScript.transform.parent = tileFolder.transform;
	tileScript.transform.position = Vector3(x,y,0);

	tileScript.init(x, y, tileType, charOn);
	
	tileScript.name = "Tile "+x+" "+y;
	tiles[y][x] = tileScript;

	
	if( tileType == "A" ) {
		GreenTargets[0] = tileScript;
		if(reqGreenTargets<1) {
			reqGreenTargets=1;
		}
	} else if( tileType == "B" ) {
		GreenTargets[1] = tileScript;
		if(reqGreenTargets<2) {
			reqGreenTargets=2;
		}
	} else if( tileType == "C" ) {
		GreenTargets[2] = tileScript;
		if(reqGreenTargets<3) {
			reqGreenTargets=3;
		}
	} else if( tileType == "a" ) {
		PurpleTargets[0] = tileScript;
		if(reqPurpleTargets<1) {
			reqPurpleTargets=1;
		}
	} else if( tileType == "b" ) {
		PurpleTargets[1] = tileScript;
		if(reqPurpleTargets<2) {
			reqPurpleTargets=2;
		}
	} else if( tileType == "c" ) {
		PurpleTargets[2] = tileScript;
		if(reqPurpleTargets<3) {
			reqPurpleTargets=3;
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

//collects Green targets and sets the next one up
function collectGreen() {
	//Starts the spinnnnnniiiiiinnnnnnngggggggg
	GreenChar.spinny();
	//sets type to be wall, reverts model to blank, set collectable to be false
	GreenChar.currentTile.collect(); 
	curTarGreen++;
	//check to see if there are still targets left
	if(curTarGreen <= reqGreenTargets) {
		//make it into a collectable model
		GreenTargets[curTarGreen-1].makeTarget(GreenTargets[curTarGreen-1].targetNum, curTarGreen); 
	}
	else {
		//completed Green targets
		allGreenCollected=true;
		if(allPurpleCollected) {
			youWin();
		}
	}
	audioSourceGreen= collectSoundGreen.AddComponent("AudioSource");
	audioSourceGreen.audio.clip = Resources.Load("Sounds/octave_2");
	audioSourceGreen.audio.PlayOneShot(audioSourceGreen.audio.clip ,.9);
}


//collects Purple targets and sets the next one up
function collectPurple() {
	//Starts the spinnnnnniiiiiinnnnnnngggggggg
	PurpleChar.spinny();
	PurpleChar.currentTile.collect(); //sets type to be wall, reverts model to blank, set collectable to be false
	curTarPurple++;
	//check to see if there are still targets left
	if(curTarPurple <= reqPurpleTargets) { 
		//make it into a collectable model
		PurpleTargets[curTarPurple-1].makeTarget(PurpleTargets[curTarPurple-1].targetNum, curTarPurple); 
	} else {
		allPurpleCollected=true;
		if(allGreenCollected) {
			//beat level
			youWin();
		}
	}
	audioSourcePurple= collectSoundPurple.AddComponent("AudioSource");
	audioSourcePurple.audio.clip = Resources.Load("Sounds/octave_2");
	audioSourcePurple.audio.PlayOneShot(audioSourcePurple.audio.clip ,.9);
}

//displays winning text
function youWin() {
	levelOver = true;
	GreenChar.spinny();
	GreenChar.winning = true;
	PurpleChar.spinny();
	PurpleChar.winning = true;
	
	//setting the star amounts
	if (turns.turns <= bestStar) {
		starCounts[curLevel] = 3;
	} else if (turns.turns <= okayStar) {
		starCounts[curLevel] = 2;
	} else {
		starCounts[curLevel] = 1;
	}

	var winObject = new GameObject();
	var winScript = winObject.AddComponent("win");
	winScript.transform.parent = winFolder.transform;
	winScript.init(this);
	winScript.name = "win";
	winScript.transform.position = Vector3(4, 4, -2);

	//winning sound 
	audioSourceWin = winSound.AddComponent("AudioSource");
	//audioSource2.audio.loop = true; 
	audioSourceWin.audio.clip = Resources.Load("Sounds/winsound");
	//audioSourceWin.mute = audioSource1.mute;
	audioSourceWin.audio.PlayOneShot(audioSourceWin.audio.clip ,.9);
	
	yield WaitForSeconds(audioSourceWin.audio.clip.length);				//so the next level doesn't auto load [took wayyy too long to figure out]
	curLevel++;
   	level = "Assets/Resources/Levels/level"+curLevel;
	reset(level);
}

//diaplys tutorial info in the bottom corner 1 is non-inverted 2 is inverted
function showMoveText(inversion: int) {
	var tutorialObject = new GameObject();
	var tutorialScript = tutorialObject.AddComponent("tutorial");
	tutorialScript.transform.parent = tutorialFolder.transform;
	tutorialScript.name = "tutorial";
	
	if(inversion==1) {
		var GreenButtons = Instantiate(Resources.Load("Prefabs/greenDirections", GameObject)) as GameObject;
		GreenButtons.transform.parent = tutorialScript.gameObject.transform;
		GreenButtons.transform.position = Vector3(GreenChar.transform.position.x,GreenChar.transform.position.y,-.001);
	} else if(inversion==2) {
		var PurpleButtons = Instantiate(Resources.Load("Prefabs/purpleDirections", GameObject)) as GameObject;
		PurpleButtons.transform.parent = tutorialScript.gameObject.transform;
		PurpleButtons.transform.position = Vector3(PurpleChar.transform.position.x,PurpleChar.transform.position.y,-.001);
	}
}


//clear the map (identified with a string).
function reset(map : String) {
	levelOver = false;
	var children : int = tileFolder.transform.childCount;
 		for (var i = children - 1; i >= 0; i--) {
   			Destroy(tileFolder.transform.GetChild(i).gameObject);
		}
		Destroy(GreenChar.gameObject);
		Destroy(PurpleChar.gameObject);

		tiles.Clear();

		reqGreenTargets=0;
		reqPurpleTargets=0;
		buildMap(map);
		turns.reset();
		if(reqPurpleTargets==0) {
			allPurpleCollected=true;
		} else {
			allPurpleCollected=false;
		}
		if(reqGreenTargets==0) {
			allGreenCollected=true;
		} else {
			allGreenCollected=false;
		}
		levelSet = curLevel/numLevelSets;
		audioSource1.audio.clip = Resources.Load("Sounds/loop_"+levelSet*10);
		audioSource1.audio.Play();

		//clears out winning display
		var winObjectsToDestroy : int = winFolder.transform.childCount;
		for (i = winObjectsToDestroy - 1; i >= 0; i--) {
			Destroy(winFolder.transform.GetChild(i).gameObject);
		}

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
	Destroy(GreenChar.gameObject);
	Destroy(PurpleChar.gameObject);
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
	levelDisplayScript.transform.position = Vector3(-3, 0, -2);
	
	levelDisplayScript.init(this, curLevel);
	
	levelDis = levelDisplayScript;
	levelDisplayScript.name = "levelDisplay";
}

function addCounter() {
	var countObject = new GameObject();
	var countScript = countObject.AddComponent("turnCounter");
	
	countScript.transform.parent = transform;
	countScript.transform.position = Vector3(12, 8, -2);

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
function OnGUI () {
    var buttonHeight: int= Screen.width/20;
    var buttonWidth: int =Screen.width/14;
    numLevels = 52; 	//number of levels we currently have (0 indexed)
    var numPerRow: int = 5;

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
    }
}