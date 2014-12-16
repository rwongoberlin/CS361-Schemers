#pragma strict

var levelFolder : GameObject;				//holds tiles for hierarchy pane

function Start () {

	// if there is not already a currentLevel object, make one (only applies when not running form build)
	var cL = GameObject.Find("currentLevel");
	//print(currentLevel);
	if(cL == null) {
		makeCurLevel();
	}
	
	levelFolder = new GameObject();
	levelFolder.name = "LevelFolder";
	
	var levelPrefab = Resources.Load("Prefabs/level", GameObject);
	
	for(var i=0; i<47; i++) {
		
		var levelI = Instantiate(levelPrefab) as GameObject;
		levelI.transform.parent = levelFolder.transform;
		levelI.transform.position = Vector3((i%10)*1.5, (0-(i/10))*1.5, 0);
		(levelI.GetComponent("level") as level).init(i);
		levelI.name = "level"+i;
	}
}

function Update () {

}

private function makeCurLevel() {
	var levelObject = GameObject();
	var levelScript = levelObject.AddComponent("currentLevel");

	levelScript.name = "currentLevel";
}