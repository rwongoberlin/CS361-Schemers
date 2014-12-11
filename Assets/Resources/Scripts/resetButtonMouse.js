#pragma strict

var gM : gameManager;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;

	name= "reset button";
//	transform.position = Vector3(Screen.width/4, Screen.height/4, 0);
	transform.localScale = Vector3(1.5, 1, 1);		
	renderer.material.mainTexture = Resources.Load("Textures/reset", Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
	renderer.material = Resources.Load("Materials/reset") as Material;
}

function Update () {
	if(Input.GetKeyDown("r")) {
		gM.reset();
	}
}

function OnMouseDown() {
	gM.reset();
}