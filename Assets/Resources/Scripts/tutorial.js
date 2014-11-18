/*
class created by Robin 
displays wasd text for tutorial levels
*/

var owner : gameManager;
var solid : int; //how solid to make the tutorial text
//var	tutorialText : TextMesh;

function init(o : gameManager, first : int, level : int) {
	owner = o;
	solid =255-level*100;

	transform.localScale = Vector3(0.5, 0.5, 0.5);
	winText = gameObject.AddComponent(TextMesh).GetComponent(TextMesh);
	if(first==1) {
		winText.text = "  w \na   d\n  s ";
		winText.color = Color(195, 0, 0, solid);
	}
	else {
		winText.text = "  s \nd   a\n  w ";
		winText.color = Color(0, 138, 184, solid);
	}

	//158, 82, 206
	winText.offsetZ = -1;
	winText.fontSize = 12;
	var courier : Font =  Resources.Load("Fonts/CourierNew") as Font;
	winText.font = courier;
	
	gameObject.renderer.material = courier.material;

}
