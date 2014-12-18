var levelNum : int;

function init(num : int) {
	levelNum = num;
	(transform.GetComponentInChildren(TextMesh) as TextMesh).text = "" + num;
}

function OnMouseDown() {
	GameObject.Find("currentLevel").GetComponent(currentLevel).curLevel = levelNum;
	Application.LoadLevel("start");
}