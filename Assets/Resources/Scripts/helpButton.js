#pragma strict

var gM : gameManager;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;
}

function Update () {
	if(Input.GetKeyDown("space")||Input.GetKeyDown("h")) {
		gM.tutorialText(1);
  		gM.tutorialText(2);
	}
	if (Input.GetKeyUp("space")||Input.GetKeyUp("h")) {
		gM.Destroy(gM.tutorialFolder.transform.GetChild(0).gameObject);
		gM.Destroy(gM.tutorialFolder.transform.GetChild(1).gameObject);
	}
}

function OnMouseDown() {
	gM.help = true;
}