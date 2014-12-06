/*
class by Devin Frenze for moving background
*/

var cloudFolder : GameObject;
var numClouds = 12;
var cloud1 : GameObject;
var cloudPrefabs : Array;

function Start() {
}

function init() {
	cloudFolder = new GameObject();
	cloudFolder.name = "cloudFolder";
	cloud1 = Resources.Load("Prefabs/cloud1", GameObject);

	cloudPrefabs = new Array(8);
	for(i=0; i<8; i++) {
		var name = "Prefabs/cloud"+(i+1);
		var cloud = Instantiate(Resources.Load(name, GameObject));
		cloud.transform.parent = cloudFolder.transform;
		cloud.SetActive(false);
		cloudPrefabs[i] = cloud;
	}
	
	for(i=0; i<numClouds; i++) {
		var cloudObject = Instantiate(cloudPrefabs[Mathf.FloorToInt(Random.Range(0, 7.9))]) as GameObject;
		
		var width = cloudObject.transform.localScale.x;
		var height = cloudObject.transform.localScale.z;
		var z = i+1;
		
		var coef = (z+10)*2*Mathf.Sin(30*Mathf.Deg2Rad);
		var x = Random.Range( 4-coef, 4+coef);
		var y = Random.Range( 4-coef*2/3, 4+coef*2/3);
		var position = Vector3(x,y,z);
		
		cloudObject.transform.localScale = Vector3( cloudObject.transform.localScale.x*z/5, 0.1, cloudObject.transform.localScale.z*z/5);
		cloudObject.transform.parent = cloudFolder.transform;
		cloudObject.transform.position = position;
		
		cloudObject.SetActive(true);
		
		var movement = cloudObject.GetComponent(cloudMovement);
		movement.init();
	}
}

function Update() {
}