/*
class created by Robin (based off of turn counter)
For now just displays text
*/

//TODO: clear upon loading a new level
var owner : gameManager;
var winText : TextMesh;

function init(o : gameManager) {
	owner = o;
	
	winText = gameObject.AddComponent(TextMesh).GetComponent(TextMesh);
	winText.alignment = TextAlignment.Center;
	winText.text = "you win!";
	winText.anchor = TextAnchor.MiddleCenter;
	winText.color = Color(1, 1, 1, 1);
	//158, 82, 206
	winText.offsetZ = -1;
	winText.fontSize = 256;
	winText.characterSize = 0.075;
	var courier : Font =  Resources.Load("Fonts/TrashHand") as Font;
	winText.font = courier;
	
	gameObject.renderer.material = courier.material;
}
