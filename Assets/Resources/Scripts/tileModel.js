var click;
var tiles;
var tileType;
var type : int; //0 is blank, 1 is wall, 2 is pit, 11-19 are targets for char 1, 21-29 are targets for char 2
var count : int;
var collectable: boolean; //if the tile is collectable

function init(T : tile) {									
	transform.parent = T.transform;				
	transform.localPosition = Vector3(0,0,0);	
	name = "Tile Model";
	tileType = T.type;			
	collectable=false; 				
	
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
	tileType=localTargetNum/10;					
	
	//blue
	if(tileType==1) {
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



