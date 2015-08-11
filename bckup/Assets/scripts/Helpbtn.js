#pragma strict

function OnMouseDown () {
	EM_tutorial_control.in_tutorial = false;
	Application.LoadLevel(2);
}