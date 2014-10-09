var neighborsList : Array;
var x : float;
var y : float;
var t : target;
var charOn : int; // if 0, nothing on, if 1, character is on tile

function init(xS : float, yS : float) {
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	
	x = xS;
	y = yS;
	neighborsList = new Array();
	t = null;
	charOn = 0;
	model = modelObject.AddComponent("tileModel");			 		
	model.init(this);	
}	

function addChar() { //we can change this to simply hold the character later, rather than an int
	charOn = 1;
}

function remChar() {
	charOn = 0;
}

function getX() {
	return x;
}

function getY() {
	return y;
}
 
function addTarget(t : target) {
	this.t = t;
}

function getTarget() {
	return t;
}

function remTargets() {
	t = null;
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






