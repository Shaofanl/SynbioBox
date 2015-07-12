#pragma strict

function setStageMode() {
	GameManager.isStageMode = true;
	GameManager.isEndlessMode = false;
	Application.LoadLevel(4);
}

function setEndlessMode() {
	GameManager.isStageMode = false;
	GameManager.isEndlessMode = true;
	Application.LoadLevel(4);
}