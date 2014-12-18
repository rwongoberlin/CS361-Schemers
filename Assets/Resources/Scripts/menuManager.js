var gM : gameManager;

function init(gM : gameManager) {
	this.gM = gM;
}

function Update () {
	if (Input.GetKeyDown("escape")) {
		gM.mainMenu=false;
	}
}