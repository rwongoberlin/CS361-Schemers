#pragma strict

var gM : gameManager;
var muteOn : boolean;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;
	muteOn = false;

	name="mute button";
	transform.localScale = Vector3(1.5, 1, 1);		
	renderer.material.mainTexture = Resources.Load("Textures/mute", Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
	renderer.material = Resources.Load("Materials/mute") as Material;
}

function Update () {
	if(Input.GetKeyDown("m")) {
		if(muteOn) {
			unmute();
		} else {
			mute();
		}
	}
}

function OnMouseDown() {
	if(muteOn) {
		unmute();
	} else {
		mute();
	}
}

private function mute() {
	gM.audioSource1.mute = true;
	gameObject.renderer.material.color = Color(1,1,1,0.25);
	muteOn = true;
}

private function unmute() {
	gM.audioSource1.mute = false;
	gameObject.renderer.material.color = Color(1,1,1,1);
	muteOn = false;
}