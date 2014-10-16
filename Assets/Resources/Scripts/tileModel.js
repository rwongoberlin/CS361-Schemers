var click;
var tiles;
var tileType;

function init(T : tile) {									
	transform.parent = T.transform;				
	transform.localPosition = Vector3(0,0,0);	
	name = "Tile Model";
	tileType = T.type;							
	
	renderer.material.mainTexture = Resources.Load("Textures/tile_empty", Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");	

	//this.gameObject
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

function changeColor() {
	// Set specular shader
	renderer.material.shader = Shader.Find ("Specular");
	// Set red specular highlights
	renderer.material.SetColor ("_SpecColor", Color.red);
}

