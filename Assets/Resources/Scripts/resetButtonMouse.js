var gM : gameManager;

function init(gM : gameManager) {
	this.gM = gM;

	name= "reset button";
	transform.localScale = Vector3(1.433, 0.733, 1);		
	renderer.material.mainTexture = Resources.Load("Textures/reset", Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
}

function Update () {
	if(Input.GetKeyDown("r")) {
		gM.reset();
	}
}

function OnMouseDown() {
	gM.reset();
}