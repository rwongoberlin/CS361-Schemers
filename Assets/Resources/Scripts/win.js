/*
class created by Robin (based off of turn counter)
For now just displays text
*/

//TODO: clear upon loading a new level
var owner : gameManager;
var winText : TextMesh;

function init(o : gameManager) {
	owner = o;
	
	transform.localScale = Vector3(0.5, 0.5, 0.5);
	winText = gameObject.AddComponent(TextMesh).GetComponent(TextMesh);
	winText.text = "you win!";
	winText.color = Color(1, 0, 1, 1);
	//158, 82, 206
	winText.offsetZ = -1;
	winText.fontSize = 64;
	var courier : Font =  Resources.Load("Fonts/CourierNew") as Font;
	winText.font = courier;
	
	gameObject.renderer.material = courier.material;
}
