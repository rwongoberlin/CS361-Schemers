var gM : gameManager;

function init(gM : gameManager) {
	this.gM = gM;
}

function Update () {
	if(Input.GetKeyDown("space")) {
		gM.showMoveText(1);
  		gM.showMoveText(2);
	}
	
	if (Input.GetKeyUp("space")) {
		gM.Destroy(gM.tutorialFolder.transform.GetChild(0).gameObject);
		gM.Destroy(gM.tutorialFolder.transform.GetChild(1).gameObject);
	}
}

function OnMouseDown() {
	gM.help = true;
}