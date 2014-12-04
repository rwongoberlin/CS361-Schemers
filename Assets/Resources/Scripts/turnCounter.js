/*
class created by Devin
*/
var owner : gameManager;
var turns : int;
var counterText : TextMesh;

function init(o : gameManager) {
	owner = o;
	turns = 0;
	
	transform.localScale = Vector3(0.1, 0.1, 0.1);
	counterText = gameObject.AddComponent(TextMesh).GetComponent(TextMesh);
	counterText.text = ""+Mathf.Floor(turns);
	counterText.color = Color(1,1,1, 1f);
	counterText.offsetZ = -1;
	counterText.fontSize = 64;
	var courier : Font =  Resources.Load("Fonts/CourierNew") as Font;
	counterText.font = courier;
	
	//gameObject.renderer.material = Resources.Load("Scripts/textMat");
	gameObject.renderer.material = courier.material;
	//gameObject.renderer.material.color = Color(0,0,0, 0f);
}

function addTurn() {
	turns = turns + 1;
	counterText.text = ""+Mathf.Floor(turns);
}

function reset() {
	turns = 0;
	counterText.text = ""+Mathf.Floor(turns);
}