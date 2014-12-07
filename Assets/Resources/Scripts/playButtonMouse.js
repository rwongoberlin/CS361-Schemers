#pragma strict

function Start () {

}

function Update () {

}
/*
function OnGUI() {
   GUI.BeginGroup (Rect (Screen.width / 2, Screen.height / 2, 200*5, 100*5));

	// just rotate the turnLights tile only if there are no marbles over it
		if(GUI.Button( Rect(0,0,200,100),"start")) {
			Application.LoadLevel ("start");
		}
	GUI.EndGroup ();

}*/

function OnMouseDown() {
/*    GUI.BeginGroup (Rect (Screen.width / 2, Screen.height / 2, 200*5, 100*5));

	*/// just rotate the turnLights tile only if there are no marbles over it
	Application.LoadLevel ("start");
	  } // GUI.EndGroup ();

//}