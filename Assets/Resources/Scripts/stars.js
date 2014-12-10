//display for stars on each level
var owner : gameManager;
var starNum : int;
var fallen : boolean;

//displays number of stars, lose one each time you reach a new star count 
//when you lose one, it falls off
//make relative to the cloud

function init(o : gameManager, numStar : int) {
	owner = o;
	starNum = numStar;
	fallen = false;
	
	transform.localPosition = Vector3(starNum + 9, 7, -2);
	transform.localScale = Vector3(1.1, 1.1, 1.1);	
	name = "Star Model";		
	
	renderer.material.mainTexture = Resources.Load("Textures/star" + starNum, Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
	renderer.material = Resources.Load("Materials/star" + starNum) as Material;
}

//animates the star falling & sets fallen to true
function Drop() {

}

//puts star back in place & sets fallen to false
function Reset() {

}