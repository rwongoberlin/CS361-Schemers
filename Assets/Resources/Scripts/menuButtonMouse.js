var gM : gameManager;

function init(gM : gameManager) {
	this.gM = gM;			
	name = "menu button";	
	transform.localScale = Vector3(1.433, 0.733, 1);		
	renderer.material.mainTexture = Resources.Load("Textures/menu", Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
}

function OnMouseDown() {
	Application.LoadLevel("levelBrowser");
}

function Update () {
	if(Input.GetKeyDown("m")) {
		Application.LoadLevel("levelBrowser");
	}
}