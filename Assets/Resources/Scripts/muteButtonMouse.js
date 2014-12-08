#pragma strict

var gM : gameManager;
var muteOn : boolean;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;
	muteOn = false;
}

function Update () {
	if(Input.GetKeyDown("m")) {
		if(muteOn) {
		gM.audioSource1.mute = false;
		gameObject.renderer.material.color = Color(1,1,1,1);
		muteOn = false;
	} else {
		gM.audioSource1.mute = true;
		gameObject.renderer.material.color = Color(1,1,1,0.25);
		muteOn = true;
	}
	}

}

function OnMouseDown() {
	if(muteOn) {
		gM.audioSource1.mute = false;
		gameObject.renderer.material.color = Color(1,1,1,1);
		muteOn = false;
	} else {
		gM.audioSource1.mute = true;
		gameObject.renderer.material.color = Color(1,1,1,0.25);
		muteOn = true;
	}
}