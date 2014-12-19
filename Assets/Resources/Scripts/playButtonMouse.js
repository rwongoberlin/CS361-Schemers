function OnMouseDown() {
	Application.LoadLevel ("start");
}

function Update () {
	if(Input.GetKeyDown("p")) {
		Application.LoadLevel("start");
	}
}