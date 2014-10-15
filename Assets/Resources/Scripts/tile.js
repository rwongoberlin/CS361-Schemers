var neighborsList : Array;
var x : float;
var y : float;
var t : target;
var charOn : int; // if 0, nothing on, if 1, character is on tile
<<<<<<< HEAD
var isWall : int;
var type : int;
var model;
var isPit : int;

=======
var type: int;

//keeping it in for now
function init(xS : float, yS : float) {
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	
	x = xS;
	y = yS;
	neighborsList = new Array();
	t = null;
	charOn = 0;
	isWall = 0;
	type = 0;
	model = modelObject.AddComponent("tileModel");			 		
	model.init(this);	
}	

function addChar() { //we can change this to simply hold the character later, rather than an int
	charOn = 1;
}

function makeWall() {
	isWall = 1;
	model.makeWall();
}

function makePit() {
	isPit = 1;
	model.makePit();
	model = modelObject.AddComponent("tileModel");			 		
	model.init(this,4);	
}	

function init(xS : float, yS : float, t: String) {
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	
	x = xS;
	y = yS;
	if (t == '_') {
		type = 0;
	} else if (t == 'x') {
		type = 1;
	} else if (t == 'o') {
		type = 2;
	}
	else type = 0;
	neighborsList = new Array();	
	model = modelObject.AddComponent("tileModel");	
	//model = modelObject.AddComponent("BoxCollider");		
	model.init(this, type);	
	 	
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
