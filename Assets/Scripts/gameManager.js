/*
LITTLE SCHEMERS GAME MANAGER
*/

import System.IO;

var tileFolder : GameObject;
var tiles : Array;
public var tiles2 : Array;

var characterFolder : GameObject;
var characters : Array;

var turns : turnCounter;
var level : String = "Assets/Resources/Levels/demo1.txt";

// Called once when the script is created.
function Start () {
	tileFolder = new GameObject();
	tileFolder.name = "Tiles";
	tiles = new Array();
	tiles2 = new Array();
	
	characterFolder = new GameObject();
	characterFolder.name = "characters";
	characters = new Array();
	var boardsize:int =8;
	
	generateBoard(boardsize, boardsize);
	setNeighbors();
	
	addCharacter(0, 1, 1, 0);
	addCharacter(2, 2, 3, 1);
	
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
	characterScript.init(x, y, rotation, myTile, tiles2, typeL);
	
	characters.Add(characterScript);
	characterScript.name = "character " + characters.length;
}

// Generates a board randomly (rows is num of rows, columns is the same, turnDensity is num of turn tiles)
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
	print(tileType);
	var ascii : int = tileType[0];
	print(ascii);
	if(tileType == "1" || tileType == "2") {
		addCharacter(x, y, 0, parseInt(tileType)-1);
		tileType = "_";
	} else if((65 <= ascii && ascii <= 68 )|| (97 <= ascii && ascii <= 100)) {
		addTarget(x, y, ascii);
		tileType = "_";
	}
	var tileScript = tileObject.AddComponent("tile");
	
	tileScript.transform.parent = tileFolder.transform;
	tileScript.transform.position = Vector3(x,y,0);
	//tileScript.init(tileType);

	tiles.Add(tileScript);
	tileScript.name = "Tile "+tiles.length;
	print(tileScript.name);
	return tileScript;
}

/*
method added by Devin
TODO add method for adding targets
*/
function addTarget (x : float, y : float, ascii : int) {
}

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