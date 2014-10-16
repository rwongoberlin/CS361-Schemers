var tileFolder : GameObject;
var tiles : Array;
public var tiles2 : Array;

var characterFolder : GameObject;
var characters : Array;

// Called once when the script is created.
function Start () {
	tileFolder = new GameObject();
	tileFolder.name = "Tiles";
	tiles = new Array();
	tiles2 = new Array();
	
	characterFolder = new GameObject();
	characterFolder.name = "characters";
	characters = new Array();
	var boardsize : int = 7;
	
	generateBoard(boardsize, boardsize);
	setNeighbors();
	
	addcharacter(0, 0, 1, 2);
	addcharacter(6, 2, 1, 1);
	
	tiles2[3][1].makeTarget(11); //1 is blue 
	tiles2[0][2].makeTarget(12); 

	tiles2[2][0].makeTarget(21); //2 is red
	tiles2[5][0].makeTarget(22);

	tiles2[1][0].makeWall();
	tiles2[2][1].makeWall();

	tiles2[1][1].makePit();
	tiles2[4][1].makePit();
	for(var k: int =0;k<7;k++) {
		tiles2[k][3].makeWall();
	}

}

// Called every frame.
function Update () {
	/*if (Input.GetMouseButtonUp(0)) { // If the user releases the mouse button, figure out where the mouse is and spawn a gem.
		var worldPos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
		var mouseX = worldPos.x;
		var mouseY = worldPos.y;	
	}*/
	characters[0].model.setTile();
	characters[1].model.setTile();
	if (!characters[0].model.currentTile.isPit && !characters[1].model.currentTile.isPit && characters[0].model.currentTile!=characters[1].model.currentTile) {
		characters[0].model.move();
		characters[1].model.move();
	}
	else {
		characters[0].model.pitReset();
		characters[1].model.pitReset();
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
	if (typeL == 0) {
		characterScript.init(x, y, rotation, myTile, tiles2, typeL, characters);
	} else {
		characterScript.init(x, y, rotation, myTile, tiles2, typeL, characters);
	}

	characters.Add(characterScript);
	
	characterScript.name = "character " + characters.length;
}

/*function linkCharacters() {
	characters[0].model.otherchar = characters[1];
	characters[1].model.otherchar = characters[0];
}*/

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
	tileScript.name = "Tile " + x+","+y;
	return tileScript;	 
}