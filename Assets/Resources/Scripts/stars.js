//display for stars on each level
var owner : gameManager;
var numstars: int;
//displays number of stars, lose one each time you reach a new star count 
//when you lose one, it falls off
//make relative to the cloud
//garbage colect

function init(numstars:int) {
	//numstars=this;
//	numstars=1;
	transform.localPosition = Vector3(numstars, 0, -1);
	transform.localScale = Vector3(1.1, 1.1, 1.1);	
	name = "StarModel";
	renderer.material.mainTexture = Resources.Load("Textures/star" + numstars, Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
	renderer.material = Resources.Load("Materials/star"+numstars) as Material;
}

function setStars(numstars:int) {
	//numstars=this;
	renderer.material.mainTexture = Resources.Load("Textures/star"+numstars, Texture2D);	
}