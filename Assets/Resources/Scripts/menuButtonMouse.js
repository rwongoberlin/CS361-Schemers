﻿#pragma strict

var gM : gameManager;
function Start () {

}

function init(gM : gameManager) {
	this.gM = gM;			
	name="menu button";	
//	transform.position = Vector3(Screen.width/4, Screen.height/4, 0);
	transform.localScale = Vector3(1.433, 0.733, 1);		
	renderer.material.mainTexture = Resources.Load("Textures/menu", Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
	//renderer.material = Resources.Load("Materials/menu") as Material;					
}

function Update () {
	/*if ((Input.GetKeyDown("escape")||(Input.GetKeyDown("l")))&&(gM.mainMenu==true)) {
		gM.mainMenu=false;
	}
	else if ((Input.GetKeyDown("escape")||(Input.GetKeyDown("l")))&&(gM.mainMenu==false)) {
		gM.mainMenu=true;
	}*/
}

function OnMouseDown() {
	Application.LoadLevel("levelBrowser");
	//gM.mainMenu = true;
}