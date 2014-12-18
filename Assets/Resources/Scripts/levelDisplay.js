var owner : gameManager;
var level : int;
var levelText : TextMesh;

function init (o : gameManager, levelNum : int) {
	owner = o;
	level = levelNum;
	
	transform.localScale = Vector3(.9, .9, .9);
	levelText = gameObject.AddComponent(TextMesh).GetComponent(TextMesh);
	levelText.alignment = TextAlignment.Center;
	levelText.anchor = TextAnchor.MiddleCenter;
	levelText.text = "Level " + level.ToString();
	levelText.color = Color(0,0,0,1);
	levelText.fontSize = 256; 
	levelText.characterSize = 0.05;
	var courier : Font =  Resources.Load("Fonts/TrashHand") as Font;
	levelText.font = courier;
	gameObject.renderer.material = courier.material;
}

function changeLevel(newLevel : int) {
	level = newLevel;
	levelText.text = "Level " + level.ToString();
}


















