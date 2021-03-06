﻿#pragma strict

function Start() {
	if (!PlayerPrefs.HasKey("em_need_help")) 
		PlayerPrefs.SetInt("em_need_help", 1);
}

function setStageMode() {
	GameManager.isStageMode = true;
	GameManager.isEndlessMode = false;
	Application.LoadLevel(9);
}

function setEndlessMode() {
	var em_need_help = PlayerPrefs.GetInt("em_need_help");
	
	GameManager.isStageMode = false;
	GameManager.isEndlessMode = true;
	if (em_need_help == 1) {
		EM_tutorial_control.in_tutorial = true;
		Application.LoadLevel(6);
		//PlayerPrefs.SetInt("em_need_help", 0);
	}
	else 
		Application.LoadLevel(4);
}
