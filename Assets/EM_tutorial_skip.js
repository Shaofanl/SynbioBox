#pragma strict

function OnMouseDown () {
	GameManager.isPlaying = true;
	Application.LoadLevel(4);
}