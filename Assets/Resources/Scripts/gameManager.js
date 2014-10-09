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
	
	addcharacter(0, 1, 1, 0);
	addcharacter(2, 2, 3, 1);
	
	addTarget(0, 0, 1, 1);
	addTarget(0, 4, 1, 2);
	//print(maincCount);
	addTarget(4, 4, 2, 1);
	addTarget(3, 2, 2, 2);
	
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

function addcharacter(x : float, y : float, rotation : float, typeL : int) {
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