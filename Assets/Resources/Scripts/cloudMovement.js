var speed : float;
var coef :float;
var loop : boolean;

function init() {
	speed = Random.Range(0.2,1);
	coef = Mathf.Sin(30 * Mathf.Deg2Rad)*transform.position.z+transform.localScale.x;
	loop = false;
}

function Update () {
	if(loop) {
		transform.Translate(Vector3(2.5*transform.position.x,0,0));
		loop=false;
	}
	else {
		transform.Translate(Vector3(-1*Time.deltaTime*speed,0,0));
	}
}

function OnBecameInvisible() {
	if(transform.position.x>coef){
		loop=true;
	}
}