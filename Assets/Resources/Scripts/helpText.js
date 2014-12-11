#pragma strict

var gM : gameManager;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;
//	transform.position = Vector3(Screen.width/4, Screen.height/4, 0);
//	transform.localScale = Vector3(1, 1, 1);			
//	renderer.material.mainTexture = Resources.Load("Textures/helpMenu", Texture2D);	
//	renderer.material.color = Color(1,1,1);										
//	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
//	renderer.material = Resources.Load("Materials/helpMenu") as Material;
}

function Update () {
	if(Input.GetKeyDown("space")) {
		gM.showMoveText(1);
  		gM.showMoveText(2);
	}
	if (Input.GetKeyUp("space")) {
		gM.Destroy(gM.tutorialFolder.transform.GetChild(0).gameObject);
		gM.Destroy(gM.tutorialFolder.transform.GetChild(1).gameObject);
	}
}

function OnMouseDown() {
	gM.help = true;
}