import System.IO;

var tileFolder : GameObject;
var tiles : Array;
public var tiles2 : Array;

var characterFolder : GameObject;
var characters : Array;

var mainTargets : Array;
var mirrorTargets : Array;
var targetFolder : GameObject;

var mainCount : int;
var mirrorCount : int;

var turns : turnCounter;
var level : String = "Assets/Resources/Levels/demo1.txt"; //not reading? 

// Called once when the script is created.
function Start () {
	tileFolder = new GameObject();
	tileFolder.name = "Tiles";
	tiles = new Array();
	tiles2 = new Array();
	
	characterFolder = new GameObject();
	characterFolder.name = "characters";
	characters = new Array();


	var boardsize : int = 8;
	
	mainTargets = new Array();
	mirrorTargets = new Array();
	targetFolder = new GameObject();
	targetFolder.name = "Targets";
	
	mainCount = 0;
	mirrorCount = 0;
	
	generateBoard(boardsize, boardsize);
	setNeighbors();
	//about to be deleted
	//addCharacter(0, 1, 1, 0);
	//addCharacter(2, 2, 3, 1);
	
	//addTarget(0, 0, 1, 1);
	//addTarget(0, 4, 1, 2);

	//addTarget(4, 4, 2, 1);
	//addTarget(3, 2, 2, 2);
	

		//print(maincCount);
	buildMap(level);
	addCounter();
}
	
function buildMap(map : String) {	
	try {
        // Create an instance of StreamReader to read from a file.
        sr = new StreamReader(map);
        // Read and display lines from the file until the end of the file is reached.
        line = sr.ReadLine();

        y = 9;
        var current : String;
        var curRot : int;
        
        while (line != null) {
            row = line.Split(' '[0]);
            for( x = 0; x < 10; x++) {
            	current = row[x];
				addTile(x, y, current);
            }
            line = sr.ReadLine();
            y--;
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
	if (Input.GetMouseButtonUp(0)) { // If the user releases the mouse button, figure out where the mouse is and spawn a gem.
		var worldPos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
		var mouseX = worldPos.x;
		var mouseY = worldPos.y;	
	}
} 

function setNeighbors() {
	var xs = tiles2.length - 1;
	var ys = tiles2[0].length - 1;
	for (T in tiles) {
		var x = T.getX();
		var y = T.getY();
		
		//Eastside
		if ((x+1) > xs) {
			T.addNeighbors(tiles2[x][y]);
		} else {
			T.addNeighbors(tiles2[x+1][y]); 
		}
		//Southside
		if ((y-1) < 0) {
			T.addNeighbors(tiles2[x][y]);
		} else {
			T.addNeighbors(tiles2[x][y-1]); 
		}
		//Westside
		if ((x-1) < 0) {
			T.addNeighbors(tiles2[x][y]);
		} else {
			T.addNeighbors(tiles2[x-1][y]);
		} 
		//Northside 
		if ((y+1) > ys) { 
			T.addNeighbors(tiles2[x][y]);
		} else {
			T.addNeighbors(tiles2[x][y+1]); 
		}
	} 
}

function addCharacter(x : float, y : float, rotation : float, typeL : int) {
	var characterObject = new GameObject();
	var characterScript = characterObject.AddComponent("character");
	
	characterScript.transform.parent = characterFolder.transform;
	characterScript.transform.position = Vector3(x, y, 0);
	 
	var myTile = tiles2[x][y];
	//myTile.pluscharacter(characterScript);
	if (typeL == 0) {
		characterScript.init(x, y, rotation, myTile, tiles2, typeL, mainTargets);
	} else {
		characterScript.init(x, y, rotation, myTile, tiles2, typeL, mirrorTargets);
	}
	
	characters.Add(characterScript);
	characterScript.name = "character " + characters.length;
}

// Generates a board 
function generateBoard(columns : float, rows : float) {	 
	for(var i : int=0; i < columns; i++) {
		var columnNum = new Array();
		for(var j : int=0; j < rows; j++) {
			var currentT = addTile(i, j);
			columnNum.Add(currentT);		
		}
		tiles2.Add(columnNum);
	}
}

function tileAt(x : float, y : float) {
	return tiles2[x][y];
}

function addTarget(x : int, y : int, type : int, number : int) {
	var target = new GameObject();
	var targetScript = 	target.AddComponent("target");
	
	targetScript.transform.parent = targetFolder.transform;
	targetScript.transform.position = Vector3(x, y, 0);
	
	targetScript.init(x, y, type, number);
	
	var curTile = tiles2[x][y];
	curTile.addTarget(targetScript);
	
	if (type == 1) {
		mainTargets.Add(target);
		targetScript.name = "Target " + mainTargets.length;
	} else {
		mirrorTargets.Add(target);
		targetScript.name = "Target " + mirrorTargets.length;
	}
}


function addTile(x : float, y : float) { 
	var tileObject = new GameObject();
	var tileScript = tileObject.AddComponent("tile");
	
	tileScript.transform.parent = tileFolder.transform;
	tileScript.transform.position = Vector3(x, y, 0);
	
	tileScript.init(x, y);
	
	tiles.Add(tileScript);
	tileScript.name = "Tile " + tiles.length;
	return tileScript;	 
}


//second wave
/*
addTile (float, float, String) method by Devin
added to support tile creation w/ different types of tiles

TODO figure out rotation or characters, currently it just defaults to 0
TODO create more tile images
TODO tell whoever created tile.js that it needs a type argument in its init method


character 1 = 1
character 2 = 2
blank tile = _
wall = x
pit = o

targets for char 1 = A B C D
targets for char 2 = a b c d
*/
function addTile (x : float, y : float, tileType : String) {
	var tileObject = new GameObject();
	
	// check to see if this tile has a character or a target on it
	// if so, add that AND a blank tile
//	print(tileType);
	var ascii : int = tileType[0];
	//print(ascii);
	if(tileType == "1" || tileType == "2") {
		addCharacter(x, y, 0, parseInt(tileType)-1);
		tileType = "_";
	} else if((65 <= ascii && ascii <= 68 )|| (97 <= ascii && ascii <= 100)) {
		//quick fix for getting models to show up
		var targetnum; 
		if (ascii<=68) {
			targetnum=ascii-64; //subtract 65 to start with 1
			tartype=1;
		}
		else {
			targetnum=ascii-96; //subtract 96 to start with 1
			tartype=2;
		}

		addTarget(x, y, tartype, targetnum);  //TODO fix to add the correct target
		tileType = "_";
	}

	var tileScript = tileObject.AddComponent("tile");
	
	tileScript.transform.parent = tileFolder.transform;
	tileScript.transform.position = Vector3(x,y,0);
	//tileScript.init(tileType);
	tileScript.init(x, y, tileType);
	tiles.Add(tileScript);
	tileScript.name = "Tile "+tiles.length;
	//print(tileScript.name);
	return tileScript;
}




//second wave fine

/*
addCounter added by Devin
adds an object that keeps track of the number of moves and displays them to user

TODO whoever implements the characters has to make them talk to the gameManager so their movement can be tracked
TODO once that is done, they should call the halfMove() method of the turnCounter, named turns, every time they move
*/
function addCounter() {
	// create a marble with a reference to this (the game manager) and its position in the grid
	
	var countObject = new GameObject();
	var countScript = countObject.AddComponent("turnCounter");
	
	// establish parenthood of marbleFolder to marble
	
	countScript.transform.parent = transform;
	countScript.transform.position = Vector3(-2, 1, -2);

	// initialize marble script
	
	countScript.init(this);
	
	// organize in folder and name
	turns = countScript;
	countScript.name = "turnCounter";
}

//second wave breaks

function OnGUI () {
	if (GUI.Button (Rect (0,0,128,128), "Reset")) {
		
		var children : int = tileFolder.transform.childCount;
 		for (var i = children - 1; i >= 0; i--) {
   			Destroy(tileFolder.transform.GetChild(i).gameObject);
		}
		
		children = characterFolder.transform.childCount;
		for (var j = children - 1; j >= 0; j--) {
   			Destroy(characterFolder.transform.GetChild(j).gameObject);
		}
		tiles.Clear();
		characters.Clear();
		buildMap(level);
		turns.reset();
	}
}