#pragma strict

var gM : gameManager;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;
}

function Update () {
	if(Input.GetKeyDown("r")) {
		gM.reset();
	}
}

function OnMouseDown() {
	gM.reset();
}