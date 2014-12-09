#pragma strict

var gM : gameManager;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;
}

function Update () {
	if (Input.GetKeyDown("escape")) {
		gM.help=false;
	}

}

function OnMouseDown() {
	gM.help = true;
}