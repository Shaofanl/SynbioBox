#pragma strict

var startTime : float;

function Start () {
	startTime = Time.time;
}

function Update () {
	if (Time.time - startTime > 2)
		Application.LoadLevel(1);
}