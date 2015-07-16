#pragma strict

var startTime : float;

function Start () {
	startTime = Time.time;
	MusicControl.PlayMainBGM();
}

function Update () {
	if (Time.time - startTime > 2)
		Application.LoadLevel(1);
}