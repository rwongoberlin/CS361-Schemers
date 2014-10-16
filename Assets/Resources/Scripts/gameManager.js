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
	characters[0].setTile();
	characters[1].setTile();
	if (!characters[0].currentTile.isPit && !characters[1].currentTile.isPit && characters[0].currentTile!=characters[1].currentTile) {
		characters[0].move();
		characters[1].move();
	}
	else {
		characters[0].pitReset();
		characters[1].pitReset();
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

function addcharacter(x : int, y : int, rotation : int, typeL : int) {
	var characterObject = GameObject.CreatePrimitive(PrimitiveType.Quad); //new empty game object
	characterObject=addcharacterModel(characterObject,rotation ,typeL); //set that object to be character textured
	var characterScript = characterObject.AddComponent("character");
	
	characterScript.transform.parent = characterFolder.transform;
	characterScript.transform.position = Vector3(x, y, 0);

	var myTile = tiles2[x][y];
	if (typeL == 1) {
		characterScript.init(x, y, rotation, myTile, tiles2, typeL, characters);
	} else {
		characterScript.init(x, y, rotation, myTile, tiles2, typeL, characters);
	}
	
	characters.Add(characterScript);
	
	characterScript.name = "character " + characters.length;
}

function addcharacterModel(characterObject : GameObject, rotation: int, typeL: int) {


	if (typeL == 1) {
	characterObject.renderer.material.mainTexture = Resources.Load("Textures/character_blue", Texture2D);		// Set the texture.  Must be in Resources folder.
	} else {
	characterObject.renderer.material.mainTexture = Resources.Load("Textures/character_red", Texture2D);		// Set the texture.  Must be in Resources folder.
	}																					// Set the color (easy way to tint things).		renderer.material.color = Color(1,1,1);										
	characterObject.renderer.material.color = Color(1,1,1);										

	characterObject.renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	if (rotation == 2) { transform.eulerAngles = Vector3(0, 0, 90); }  
	else if (rotation == 1) { transform.eulerAngles = Vector3(0, 0, 180); }  
	else if (rotation == 0) { transform.eulerAngles = Vector3(0, 0,  -90); } 

return characterObject;
}

// Generates a board randomly (rows is num of rows, columns is the same, turnDensity is num of turn tiles)
function generateBoard(columns : int, rows : int) {	 
	for(var i : int=0; i < columns; i++) {
		var columnNum = new Array();
		for(var j : int=0; j < rows; j++) {
			var currentT = addTile(i, j);
			columnNum.Add(currentT);		
		}
		tiles2.Add(columnNum);
	}
}

function tileAt(x : int, y : int) {
	return tiles2[x][y];
}

function addTile(x : int, y : int) { 
	var tileObject = new GameObject();
	var tileScript = tileObject.AddComponent("tile");
	
	tileScript.transform.parent = tileFolder.transform;
	tileScript.transform.position = Vector3(x, y, 0);
	
	tileScript.init(x, y);
	
	tiles.Add(tileScript);
	tileScript.name = "Tile " + x+","+y;
	return tileScript;	 
}