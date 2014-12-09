#pragma strict

var gM : gameManager;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;
}

function Update () {
	if (Input.GetKeyDown("escape")) {
		Destroy(gameObject.Find("helpMenu"));
		gM.help=false;
	}

}

function OnMouseDown() {
	if(gM.help == true) {
		Destroy(gameObject.Find("helpMenu"));
		gM.help = false;
	} else {
		var helpMenu = Instantiate(Resources.Load("Prefabs/helpMenu", GameObject));
		helpMenu.transform.parent = transform;
		helpMenu.GetComponent(helpButtonMouse).init(gM);
		helpMenu.name = "helpMenu";
		gM.help = true;
	}
}