/*
class created by Robin 
displays wasd text for tutorial levels
*/

var owner : gameManager;
var solid : int; //how solid to make the tutorial text

function init(o : gameManager, first : int) {
	owner = o;
	solid = 255;

	transform.localScale = Vector3(0.5, 0.5, 0.5);
	winText = gameObject.AddComponent(TextMesh).GetComponent(TextMesh);
	
	if(first==1) {
		winText.text = "Everyone knows:\n triangles love circles.\nEven if they move\n in opposite directions.\nWalls are your friends;\n The darkness is not. \n";
		winText.color = Color(255, 255, 255, solid);
	} else if(first==2) {
		winText.text = "Your journey begins now";
		winText.color = Color(255, 255, 255, solid);
	}
	
	if(first==3) {
		winText.text = "  s \nd   a\n  w ";
		winText.color = Color(0, 255, 255, solid);
	} else if (first==4){
		winText.text = "  w \na   d\n  s ";
		winText.color = Color(195, 0, 0, solid);
	}
	
	winText.offsetZ = -1;
	winText.characterSize = 0.075;
	winText.fontSize = 128;
	var hand : Font =  Resources.Load("Fonts/TrashHand") as Font;
	winText.font = hand;
	
	gameObject.renderer.material = hand.material;
}