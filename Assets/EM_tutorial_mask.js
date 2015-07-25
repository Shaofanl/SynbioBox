#pragma strict

function Start() {	
}

function OnMouseDown() {
	transform.position.z = -100;
	Time.timeScale = 1;
	Debug.Log("unlock");
}