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
	
	renderer.material.mainTexture = Resources.Load("Textures/gem" + type, Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");	
}
//
//function getCount() {
//	return count;
//}

