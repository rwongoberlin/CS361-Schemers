var tileFolder : GameObject;
var tiles : Array;
public var tiles2 : Array;

var marbleFolder : GameObject;
var marbles : Array;

// Called once when the script is created.
function Start () {
	tileFolder = new GameObject();
	tileFolder.name = "Tiles";
	tiles = new Array();
	tiles2 = new Array();
	
	marbleFolder = new GameObject();
	marbleFolder.name = "Marbles";
	marbles = new Array();
	
	generateBoard(6, 6);
	setNeighbors();
	
	addMarble(0, 1, 1, 0);
	addMarble(2, 2, 3, 1);
	
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

function addMarble(x : float, y : float, rotation : float, typeL : int) {
	var marbleObject = new GameObject();
	var marbleScript = marbleObject.AddComponent("marble");
	
	marbleScript.transform.parent = marbleFolder.transform;
	marbleScript.transform.position = Vector3(x, y, 0);
	 
	var myTile = tiles2[x][y];
	//myTile.plusMarble(marbleScript);
	marbleScript.init(x, y, rotation, myTile, tiles2, typeL);
	
	marbles.Add(marbleScript);
	marbleScript.name = "Marble " + marbles.length;
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
