#pragma strict

function OnMouseDown () {
	// PlayerPrefs.Save(); automatically
	GameManager.isPlaying = false;
	Application.LoadLevel(1);
	//MusicControl.PlayMainBGM();
}