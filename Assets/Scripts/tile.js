var neighborsList : Array;
var x : float;
var y : float;
var type : int;

function init(xS : float, yS : float, t : int) {
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	
	x = xS;
	y = yS;
	type = t;
	neighborsList = new Array();
	model = modelObject.AddComponent("tileModel");	
	//model = modelObject.AddComponent("BoxCollider");			 		
	model.init(this);	
}	

function getX() {
	return x;
}

function getY() {
	return y;
}

function addNeighbors(T : tile) { //x is the length of tiles, y is length of tiles[0]
	neighborsList.Add(T);
}

function changeC(){
	// Set specular shader
	renderer.material.shader = Shader.Find ("Specular");
	// Set red specular highlights
	renderer.material.SetColor ("_SpecColor", Color.red);
}






