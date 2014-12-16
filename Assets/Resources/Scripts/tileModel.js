﻿var tile : tile;
var count : int;
var collectable: boolean; //if the tile is collectable
var tempType : String = "";
var type : String;

var moving : boolean = false;

var y0 : float;
var x0 : float;
var clock : float = 0;
var moveTime : float = 1;
var t0 : float = 0;
var tend : float = 0;
var deltat : float = 0;
//var scaling : float = 0;

function Update() {
	if (moving) {
		transform.localPosition = Vector3(x0 - x0 *(deltat/moveTime), y0 - y0*(deltat/moveTime), 0);
		deltat = clock - t0;
		if (clock >= tend) {
			moving = false;
			deltat = 0;
			tend = 0;
			t0 = 0;
			transform.localPosition = Vector3(0, 0, 0);
		}
	}
	clock = clock + Time.deltaTime;
}

//
function init(t : tile, ty : String) {
	clock = 0;									
	transform.parent = t.transform;
	x0 = Random.value*5*(1+Random.value*(-2));
	y0 = Random.value*(5)*(1 + Random.value*(-2));
	transform.localPosition = Vector3(0, y0, 0);
	transform.localScale = Vector3(1, 1, 1);	
	name = "Tile Model";
	this.tile = t;	
	this.type = ty;	
	collectable=false; 				
	
	moving = true;
	deltat = 0;
	t0 = clock;
	tend = clock + moveTime;

	renderer.material.mainTexture = Resources.Load("Textures/tile2", Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
	//renderer.material = Resources.Load("Materials/tile") as Material;
	
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
	return tile.targetNum;
} 	

//TO DO: should we remove tileType?

function OnMouseDown() {
	this.type = tempType;
	//if(editmode) {
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
		} else if ( type == "1") {
			renderer.material.mainTexture = Resources.Load("Textures/greenPlane", Texture2D);
			renderer.material.color = Color(1,1,1);										
			renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
		} else if ( type == "2") {
			renderer.material.mainTexture = Resources.Load("Textures/purplePlane2", Texture2D);
			renderer.material.color = Color(1,1,1);										
			renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
		}
	//}
}

function makeEmpty() {
	//tileType = 0;
	renderer.material.mainTexture = Resources.Load("Textures/tile2", Texture2D);
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
}

function makeWall() {
	//tileType = 1;
	renderer.material.mainTexture = Resources.Load("Textures/wall2", Texture2D);
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
}

function makePit() {
	//tileType = 2;
	renderer.material.mainTexture = Resources.Load("Textures/pit", Texture2D);
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
}

//turn the current tile into a target
//*Params: localTargetNum (target number ), curTar (the target we're supposed to collect)
function makeTarget(localTargetNum: int, curTar: int) {
	//tileType = 3;
	targetType=localTargetNum/10;					
	
	//blue
	if(targetType==1) {
		if (localTargetNum%10==curTar) {
			renderer.material.mainTexture = Resources.Load("Textures/green" + localTargetNum%10, Texture2D);
			makeCollectable();
		}
		else {
			renderer.material.mainTexture = Resources.Load("Textures/greenPit" + localTargetNum%10, Texture2D);
		
		}
		renderer.material.color = Color(1,1,1);										
		renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");	
	}
	//red
	else {
		if (localTargetNum%10==curTar) {
			renderer.material.mainTexture = Resources.Load("Textures/purple" + localTargetNum%10, Texture2D);
			makeCollectable();
		}
		else {
			renderer.material.mainTexture = Resources.Load("Textures/purplePit" + localTargetNum%10, Texture2D);
		}
		renderer.material.color = Color(1,1,1);										
		renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");	
	}
}

//collects the current target reverting the tile to a blank tile
function collect() {
		renderer.material.mainTexture = Resources.Load("Textures/tile2", Texture2D);	
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


