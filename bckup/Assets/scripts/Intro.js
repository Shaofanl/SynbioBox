#pragma strict

var startTime : float;

function Start () {
	Screen.autorotateToPortrait = true;
	Screen.autorotateToPortraitUpsideDown = true;
	Screen.autorotateToLandscapeLeft = false;
	Screen.autorotateToLandscapeRight = false;
	Screen.orientation = ScreenOrientation.AutoRotation;
	
	Time.timeScale = 1;
	startTime = Time.time;
	MusicControl.PlayMainBGM();
}

function Update () {
	if (Time.time - startTime > 2)
		Application.LoadLevel(1);
}