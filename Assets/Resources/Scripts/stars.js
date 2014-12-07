//display for stars on each level
var owner : gameManager;
var numstars: int;

function init(numstars:int) {
	//numstars=this;
	transform.localPosition = Vector3(0, 0, 30);
	transform.localScale = Vector3(1.1, 1.1, 1.1);	
	name = "Star Model";
	renderer.material.mainTexture = Resources.Load("Textures/star_"+numstars, Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");
	renderer.material = Resources.Load("Materials/tile") as Material;
}

function setStars(numstars:int) {
	//numstars=this;
	renderer.material.mainTexture = Resources.Load("Textures/star_"+numstars, Texture2D);	
}