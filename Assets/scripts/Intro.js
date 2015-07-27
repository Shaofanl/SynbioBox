#pragma strict

var startTime : float;

function Start () {
	Time.timeScale = 1;
	startTime = Time.time;
	MusicControl.PlayMainBGM();
}

function Update () {
	if (Time.time - startTime > 2)
		Application.LoadLevel(1);
}