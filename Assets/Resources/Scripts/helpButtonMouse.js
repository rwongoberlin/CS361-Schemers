#pragma strict

var gM : gameManager;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;
	name= "help button";
	transform.localScale = Vector3(1.2, 1, 1);		
	renderer.material.mainTexture = Resources.Load("Textures/helpMenu", Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
	renderer.material = Resources.Load("Materials/helpMenu") as Material;
}

function Update () {
	if (Input.GetKeyDown("escape")) {
		helpOff();
	} else if (Input.GetKeyDown(KeyCode.H)&&gM.help==false) {
		helpOn();
	} else if (Input.GetKeyDown(KeyCode.H)&&gM.help==true) {
		helpOff();
	}

}

function OnMouseDown() {
	if(gM.help == true) {
		helpOff();
	} else {
		helpOn();
	}
}

private function helpOn() {
	var helpMenu = Instantiate(Resources.Load("Prefabs/helpMenu", GameObject));
	helpMenu.transform.parent = transform;
	helpMenu.GetComponent(helpButtonMouse).init(gM);
	helpMenu.name = "helpMenu";
	gM.help = true;
}

private function helpOff() {
	Destroy(gameObject.Find("helpMenu"));
	gM.help = false;
}