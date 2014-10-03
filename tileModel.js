var click;
var tiles;
var tileType;

function init(T : tile) {									
	transform.parent = T.transform;				
	transform.localPosition = Vector3(0,0,0);	
	name = "Tile Model";							
	
	renderer.material.mainTexture = Resources.Load("Textures/tile", Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");	

	//this.gameObject

	audioSource = gameObject.AddComponent("AudioSource");
	click = 0;
} 	

function OnMouseDown () {
	if (click == 0) {
		changeColor();
		click++;
		audio.PlayOneShot(Resources.Load("Sounds/cello"), 1);
	} else {
		renderer.material.shader = Shader.Find ("Transparent/Diffuse");
		renderer.material.color = Color(1,1,1);	
		click = 0;
		audio.Stop();
		var rand = Random.Range(0, tiles.length);
		
	}
}

function changeColor() {
	// Set specular shader
	renderer.material.shader = Shader.Find ("Specular");
	// Set red specular highlights
	renderer.material.SetColor ("_SpecColor", Color.red);
}
