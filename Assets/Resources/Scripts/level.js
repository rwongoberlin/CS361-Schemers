#pragma strict

var levelNum : int;

function Start () {

}

function init(num : int) {
	levelNum = num;
	(transform.GetComponentInChildren(TextMesh) as TextMesh).text = ""+num;
	
}

function Update () {

}

function OnMouseDown() {
	GameObject.Find("currentLevel").GetComponent(currentLevel).curLevel = levelNum;
	Application.LoadLevel("start");
}