#pragma strict

function btn_again () {
	Time.timeScale = 1;
	Application.LoadLevel(4);
	//Debug.Log("again");
	
	GameManager.isOver = false;
	GameManager.isPlaying = false;	
}

function btn_bioinfo () {
	Time.timeScale = 1;
	MusicControl.PlayMainBGM();
	Application.LoadLevel(3);
	
	GameManager.isOver = false;
	GameManager.isPlaying = false;	
}

function btn_home () {
	Time.timeScale = 1;	
	Application.LoadLevel(1);
	MusicControl.PlayMainBGM();
	
	GameManager.isOver = false;
	GameManager.isPlaying = false;	
}