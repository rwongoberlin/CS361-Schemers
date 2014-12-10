#pragma strict

var gM : gameManager;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;
}

function Update () {
	if ((Input.GetKeyDown("escape")||(Input.GetKeyDown("l")))&&(gM.mainMenu==true)) {
		gM.mainMenu=false;
	}
	else if ((Input.GetKeyDown("escape")||(Input.GetKeyDown("l")))&&(gM.mainMenu==false)) {
		gM.mainMenu=true;
	}
}

function OnMouseDown() {
	gM.mainMenu = true;
}