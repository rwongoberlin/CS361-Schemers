﻿#pragma strict

var gM : gameManager;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;
}

function Update () {
	if (Input.GetKeyDown("escape")) {
		helpOff();
	} else if (Input.GetKeyDown(KeyCode.H)) {
		helpOn();
	}

}

function OnMouseDown() {
	if(gM.help == true) {
		helpOff();
	} else {
		helpOn();
	}
}

private function helpOn() {
	var helpMenu = Instantiate(Resources.Load("Prefabs/helpMenu", GameObject));
	helpMenu.transform.parent = transform;
	helpMenu.GetComponent(helpButtonMouse).init(gM);
	helpMenu.name = "helpMenu";
	gM.help = true;
}

private function helpOff() {
	Destroy(gameObject.Find("helpMenu"));
	gM.help = false;
}