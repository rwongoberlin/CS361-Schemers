//display for stars on each level
var owner : gameManager;
var starNum : int;
var fallen : boolean;
var falling : boolean;
var fallTime : float = 1;
var fallDist : float = 13;
var t0;
var deltat;
var tend;
var clock : float;

var x0;
var y0;
var z0;

//displays number of stars, lose one each time you reach a new star count 
//when you lose one, it falls off
//make relative to the cloud

function init(o : gameManager, numStar : int) {
	owner = o;
	starNum = numStar;
	fallen = false;
	falling = false;
	clock = 0;
	
	x0 = starNum + 9;
	y0 = 7;
	z0 = -2;
	transform.localPosition = Vector3(x0, y0, z0);
	transform.localScale = Vector3(1.1, 1.1, 1.1);	
	name = "Star Model";		
	
	renderer.material.mainTexture = Resources.Load("Textures/star" + starNum, Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
	renderer.material = Resources.Load("Materials/star" + starNum) as Material;
}

//animates the star falling & sets fallen to true
//I don't think this is being called ever.  It should work, though, once it gets called somewhere.
function Drop() {
	fallen = true;
	falling = false;
	t0  = clock;
	tend = clock + fallTime;
	deltat = 0;
}

//puts star back in place & sets fallen to false
function Reset() {
	fallen = false;
	transform.localPosition = Vector3(x0, y0, z0);
}

function Update() {
	if (falling)  {
		transform.localPosition =  Vector3(x0, fallDist*deltat/fallTime, z0);
		deltat = clock - t0;
		if (clock >= tend) {
			deltat = 0;
			tend = 0;
			t0 = 0;
			transform.localPosition = Vector3(x0, y0, 100);
			falling = false;
		}
	}
	clock = clock + Time.deltaTime;
}