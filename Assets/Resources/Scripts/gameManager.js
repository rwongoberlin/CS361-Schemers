var tileFolder : GameObject;
var tiles : Array;
public var tiles2 : Array;

var characterFolder : GameObject;
var characters : Array;
var curTarBlue : int = 1; //default starting target number is one
var curTarRed : int = 1; //default starting target number is one
var redTargets: Array= new Array(); //array for holding the tile objects of redTargets
var blueTargets: Array= new Array();  //array for holding the tile objects of the blue targets
//need to handle edge case for when characters move into the same square, but only one collects


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
	
	generateBoard(boardsize, boardsize);
	setNeighbors();
	

	//hardcode of level 1
	// addcharacter(6, 2, 1, 1);
	// addcharacter(0, 0, 1, 2);
	
	// convertToTarget(4,2,11,curTarBlue); 
	// convertToTarget(0,2,12,curTarBlue); 
	// convertToTarget(2,0,21,curTarRed); 
	// convertToTarget(6,0,22,curTarRed); 

	// tiles2[3][2].makeWall();

	// tiles2[1][0].makeWall();
	// tiles2[2][1].makeWall();

	// tiles2[1][1].makeWall(); //was pit
	// tiles2[4][1].makeWall();//was pit
	// for(var k: int =0;k<boardsize;k++) {
	// 	tiles2[k][4].makeWall();
	// }


//hardcode for level 2
//sound example/easy
// 

	// addcharacter(3, 2, 1, 1);
	// addcharacter(4, 2, 3, 2);
	
	// convertToTarget(4,3,11,curTarBlue); 
	// convertToTarget(0,3,12,curTarBlue); 
	// convertToTarget(6,2,13,curTarBlue); 

	// convertToTarget(2,0,21,curTarRed); 
	// convertToTarget(7,0,22,curTarRed); 
	// convertToTarget(0,2,23,curTarRed); 

	// // tiles2[3][3].makeWall();

	// // tiles2[1][0].makeWall();
	// // tiles2[2][1].makeWall();

	// //tiles2[1][1].makeWall(); //was pit
	// tiles2[4][1].makeWall();//was pit
	// for(var k: int =0;k<boardsize;k++) {
	// 	tiles2[k][4].makeWall();
	// }
// 



//level 3?
// 

	addcharacter(4, 2, 2, 1);
	addcharacter(3, 5, 1, 2);

//targets
	convertToTarget(4,3,11,curTarBlue); 
	convertToTarget(1,3,12,curTarBlue); 
	convertToTarget(6,2,13,curTarBlue); 


//left upper wall block
	 tiles2[1][5].makeWall();
	 tiles2[1][6].makeWall();
	 tiles2[1][7].makeWall();

//right upper wall block
	 tiles2[6][5].makeWall();
	 tiles2[6][6].makeWall();
	 tiles2[6][7].makeWall();

//left lower wall block
 	 tiles2[0][1].makeWall();
	 tiles2[0][2].makeWall();
	 tiles2[0][3].makeWall();

//left upper pit block
	 tiles2[0][5].makePit();
	 tiles2[0][6].makePit();
	 tiles2[0][7].makePit();


//right lower wall block
	 tiles2[7][1].makeWall();
	 tiles2[7][2].makeWall();
	 tiles2[7][3].makeWall();

//right upper pit block
	 tiles2[7][5].makePit();
	 tiles2[7][6].makePit();
	 tiles2[7][7].makePit();

//blocker pits in the upper section
	 tiles2[4][5].makePit(); //variation single
	 tiles2[4][6].makePit(); //variation  next

	for(var k: int =0;k<boardsize;k++) {
		tiles2[k][4].makeWall();
		tiles2[k][0].makeWall();

	}

	audioSource = gameObject.AddComponent("AudioSource");
	audio.PlayOneShot(Resources.Load("Sounds/loop1"), 1);
}

// Called every frame.
function Update () {

	characters[0].setTile();
	characters[1].setTile();
	if (pitCheck() && sameSpaceCheck() && targetBlockedCheck()) {
		characters[0].move();
		characters[1].move();
		//curTarRed=curTarBlue; ///for if only one target
		//target check
		if(characters[0].currentTile.model.collectable) {
			collectBlue();
			if(curTarBlue==curTarRed) {
			audio.Stop();
			audio.PlayOneShot(Resources.Load("Sounds/loop"+(curTarRed-1)), 1);
			}
		}
		if(characters[1].currentTile.model.collectable) {
			collectRed();
			if(curTarBlue==curTarRed) {
			audio.Stop();
			audio.PlayOneShot(Resources.Load("Sounds/loop"+(curTarRed-1)), 1);
			}
		}
		//	print("blue is "+curTarBlue+" . Red is : "+curTarRed);
		//for next loop
		
	}
	else {
		characters[0].pitReset();
		characters[1].pitReset();
	}
} 

//returns true if both characters are not moving into pits
function pitCheck() {
	return (!characters[0].currentTile.isPit && !characters[1].currentTile.isPit);
}

//returns true if both characters are not moving into the same space
function sameSpaceCheck() {
	return characters[0].currentTile!=characters[1].currentTile;
}

//returns false if either character tries to move into a target they are not allowed to collect
//just cases to make it false
function targetBlockedCheck() {
		curTar1 = characters[0].currentTile.getTargetNum();
		curTar2 = characters[1].currentTile.getTargetNum();
		if ((curTar1==0) && (curTar2==0)) {
			return true;
		}

// //checking to see if going for wrong character's target
	if((curTar1/10 == 2) || curTar2/10 == 1) {
		return false; 
 	}
 //	print(curTarBlue);
// //checking to see if going for wrong number target
	if (!(curTar1%10 == curTarBlue) && curTar1!=0) {
		return false;
	}
	if (!(curTar2%10 == curTarRed) && curTar2!=0) {
		return false;
	}
		return true;
	
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
		characterScript.init(x, y, rotation, myTile, tiles2, typeL);
	} else {
		characterScript.init(x, y, rotation, myTile, tiles2, typeL);
	}
	
	characters.Add(characterScript);
	
	characterScript.name = "character " + characters.length;
}

function addcharacterModel(characterObject : GameObject, rotation: int, typeL: int) {

	if (typeL == 1) {
	characterObject.renderer.material.mainTexture = Resources.Load("Textures/character_blue", Texture2D);		// Set the texture.  Must be in Resources folder.
	} 
	else {
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

//converts a  blank tile into a target tile
//args: (x position of target, y position of target, the number of the target (first digit is still type, second is target number)), current target we're supposed to collect
function convertToTarget(tilex : int ,tiley : int , targetNum: int, curTar: int) {

	tiles2[tilex][tiley].makeTarget(targetNum,curTar); //1 is blue, 2 is red
	if(targetNum/10==1) {
		blueTargets.Add(tiles2[tilex][tiley]);
	}
	else if(targetNum/10==2) {
		redTargets.Add(tiles2[tilex][tiley]); 
	}
	else {
		print("wrong target number");
	}
}

//collects blue targets and sets the next one up
function collectBlue() {
	characters[0].currentTile.collect(); //sets type to be wall, reverts model to blank, set collectable to be false
	curTarBlue++;
	//check to see if there are still targets left
	if(curTarBlue<blueTargets.length+1) {
	blueTargets[curTarBlue-1].makeTarget(blueTargets[curTarBlue-1].targetNum, curTarBlue); //make it into a collectable model
	}
	else {
		//completed blue targets
	}
}

//collects red targets and sets the next one up
function collectRed() {
	characters[1].currentTile.collect(); //sets type to be wall, reverts model to blank, set collectable to be false
	curTarRed++;
	//check to see if there are still targets left
	if(curTarRed<redTargets.length+1) {
	redTargets[curTarRed-1].makeTarget(redTargets[curTarRed-1].targetNum, curTarRed); //make it into a collectable model
	}
	else {
		//completed red targets
	}

}