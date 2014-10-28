﻿var tile : tile;
var type : int; //0 is blank, 1 is wall, 2 is pit, 11-19 are targets for char 1, 21-29 are targets for char 2
var count : int;
var collectable: boolean; //if the tile is collectable

function init(t : tile, type : String) {									
	transform.parent = t.transform;				
	transform.localPosition = Vector3(0,0,0);	
	name = "Tile Model";
	this.tile = t;		
	collectable=false; 				
	
	renderer.material.mainTexture = Resources.Load("Textures/tile_empty", Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");
	
	if( type == "_" ) {
		makeEmpty();
	} else if (	type == "x" ) {
		makeWall();
	} else if ( type == "o" ) {
		makePit();		
	} else if ( type == "A" ) {
		makeTarget( 11, 1 );
		tile.targetNum = 11;
	} else if ( type == "B" ) {
		makeTarget( 12, 1 );
		tile.targetNum = 12;
	} else if ( type == "C" ) {
		makeTarget( 13, 1 );
		tile.targetNum = 13;
	} else if ( type == "a" ) {
		makeTarget( 21, 1 );
		tile.targetNum = 21;
	} else if ( type == "b" ) {
		makeTarget( 22, 1 );
		tile.targetNum = 22;
	} else if ( type == "c" ) {
		makeTarget( 23, 1 );
		tile.targetNum = 23;
	}
} 	

function makeEmpty() {
	tileType = 0;
	renderer.material.mainTexture = Resources.Load("Textures/tile_empty", Texture2D);
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");
}

function makeWall() {
	tileType = 1;
	renderer.material.mainTexture = Resources.Load("Textures/tile_wall", Texture2D);
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");
}

function makePit() {
	tileType = 2;
	renderer.material.mainTexture = Resources.Load("Textures/tile_pit", Texture2D);
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");
}


function makeTarget(localTargetNum: int, curTar: int) {
	tileType = 3;
	targetType=localTargetNum/10;					
	
	//blue
	if(targetType==1) {
		if (localTargetNum%10==curTar) {
			renderer.material.mainTexture = Resources.Load("Textures/tile_blue_empty" + localTargetNum%10, Texture2D);
			makeCollectable();
		}
		else {
			renderer.material.mainTexture = Resources.Load("Textures/tile_blue_pit" + localTargetNum%10, Texture2D);
		
		}
		renderer.material.color = Color(1,1,1);										
		renderer.material.shader = Shader.Find ("Transparent/Diffuse");	
	}
	//red
	else {
		if (localTargetNum%10==curTar) {
			renderer.material.mainTexture = Resources.Load("Textures/tile_red_empty" + localTargetNum%10, Texture2D);
			makeCollectable();
		}
		else {
			renderer.material.mainTexture = Resources.Load("Textures/tile_red_pit" + localTargetNum%10, Texture2D);
		}
		renderer.material.color = Color(1,1,1);										
		renderer.material.shader = Shader.Find ("Transparent/Diffuse");	
	}
}

//collects the current target reverting the tile to a blank tile
function collect() {
		renderer.material.mainTexture = Resources.Load("Textures/tile_empty", Texture2D);	
		collectable=false;
}

//makes the current target collectable
function makeCollectable() {
		collectable=true;
}
//returns whether or not the current target is collectable
function isCollectable() {
	return collectable; 
}

function changeColor() {
	// Set specular shader
	renderer.material.shader = Shader.Find ("Specular");
	// Set red specular highlights
	renderer.material.SetColor ("_SpecColor", Color.red);
}


