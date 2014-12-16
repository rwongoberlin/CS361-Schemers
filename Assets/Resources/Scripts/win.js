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
	winText.color = Color(1, 0.9, 0.5, 1);
	//158, 82, 206
	winText.offsetZ = -1;
	winText.fontSize = 256;
	winText.characterSize = 0.075;
	var courier : Font =  Resources.Load("Fonts/TrashHand") as Font;
	winText.font = courier;
	
	gameObject.renderer.material = courier.material;

		for(var i=1;i<4;i++) {
		if(o.starCounts[o.curLevel]>=i) {
			var starObject = new GameObject.CreatePrimitive(PrimitiveType.Quad);
			var starScript = starObject.AddComponent("stars");
		//	starScript.transform.parent = starFolder.transform;
			
			starScript.init(o, i);


			starScript.name = "Star " + i;
			starObject.transform.localPosition=Vector3(i,0,-1);

			//stars[i - 1] = starScript;
		}
	}
}
