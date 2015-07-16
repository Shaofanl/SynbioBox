#pragma strict

function btn_again () {
	Time.timeScale = 1;
	Application.LoadLevel(4);	
}

function btn_bioinfo () {
	Time.timeScale = 1;
	MusicControl.PlayMainBGM();
	Application.LoadLevel(3);	
}

function btn_home () {
	Time.timeScale = 1;	
	Application.LoadLevel(1);
	MusicControl.PlayMainBGM();
}