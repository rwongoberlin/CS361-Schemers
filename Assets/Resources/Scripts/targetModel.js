var owner : target;
var type : int;
var count : int;

function init(o : target, typeS : int, countS : int) {
	owner = o;
	type = typeS;
	count = countS;
	
	transform.parent = owner.transform;				
	transform.localPosition = Vector3(0,0, -0.001);	
	name = "Target Model";							
	
	if(typeS==0) {
	renderer.material.mainTexture = Resources.Load("Textures/tile_blue_empty" + count, Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");	
	}
	else {
	renderer.material.mainTexture = Resources.Load("Textures/tile_red_empty" + count, Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");	
	}
}
