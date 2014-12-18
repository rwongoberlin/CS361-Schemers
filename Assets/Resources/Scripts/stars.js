//display for stars on each level
var owner : gameManager;
var starNum : int;
var fallen : boolean;
var falling : boolean;
var done: boolean;

var fallTime : float = 2;	//seconds
var fallDist : float = -Screen.height/64;
var t0;
var deltat;
var tend;

var numShakes : float = 2.0;
var shakeTime : float = 0.25;
var shakeAngle : int = 10;
var shaket0 : float;
var shakedeltat : float;
var shaketend : float;

var shaking : boolean = false;

var clock : float;

var audioSourceFall: AudioSource;	

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
	
	x0 = starNum + 10;
	y0 = 7;
	z0 = -2;
	transform.position = Vector3(x0, y0, z0);
	transform.localScale = Vector3(1.1, 1.1, 1.1);	
	name = "Star Model";		
	
	renderer.material.mainTexture = Resources.Load("Textures/star" + starNum, Texture2D);	
	renderer.material.color = Color(1,1,1);										
	renderer.material.shader = Shader.Find ("Transparent/Cutout/Soft Edge Unlit");
	renderer.material = Resources.Load("Materials/star" + starNum) as Material;
}

function Drop() {
	if(falling||done) {
		return;
	}
	
	fallen = true;
	falling = true;
	shaking = false;
	t0  = clock;
	tend = clock + fallTime;
	deltat = 0;
	//play drop sound
	audioSourceFall = gameObject.AddComponent("AudioSource");
	audioSourceFall.audio.clip = Resources.Load("Sounds/falling_sound_1");
	audioSourceFall.audio.PlayOneShot(audioSourceFall.audio.clip ,.4);
	audioSourceFall.audio.Play();
}

function wiggle() {
	shaket0 = clock;
	shaketend = clock + shakeTime;
	shaking = true;
}

//puts star back in place & sets fallen to false
function Reset() {
	fallen = false;
	falling = false;
	transform.localPosition = Vector3(x0, y0, z0);
}

function Update() {
	if (falling)  {
		transform.position =  Vector3(x0, y0 + fallDist*deltat/fallTime, z0);
		deltat = clock - t0;
		if (clock >= tend) {
			deltat = 0;
			tend = 0;
			t0 = 0;
			transform.position = Vector3(x0, 100, 100); 
			falling = false;
			done=true;
		}
	}
	if (shaking) {
		shakedeltat = clock - shaket0;																						//updates times since start of animation
		//DO NOT CHANGE THE FOLLOWING LINE
		transform.eulerAngles = Vector3(0, 0, (shakeAngle * Mathf.Sin(2.0*Mathf.PI*shakedeltat/(shakeTime/numShakes))));	//Sets the current rotation based on the animation variables.  Change the variables up top to tweak this, don't change the function here.
		//If it's time to stop shaking, clean everything up and set shaking status to false
	}
	clock = clock + Time.deltaTime;
}