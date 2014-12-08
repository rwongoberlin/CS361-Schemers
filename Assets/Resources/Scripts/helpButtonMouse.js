#pragma strict

var gM : gameManager;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;
}

function Update () {

}

function OnMouseDown() {
	gM.help = true;
}