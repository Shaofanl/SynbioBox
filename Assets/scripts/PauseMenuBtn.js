#pragma strict

function btn_continue () {
	var box = GameObject.FindGameObjectWithTag("Pause");
	box.GetComponent(RectTransform).localPosition.z = -100;
	Time.timeScale = 1;	
}

function btn_mute () {
	var l = GameObject.FindGameObjectsWithTag("mute_btn");	
	var temp_sprite : Sprite = l[0].GetComponent(SpriteRenderer).sprite;
	l[0].GetComponent(SpriteRenderer).sprite = l[1].GetComponent(UI.Image).sprite;
	l[1].GetComponent(UI.Image).sprite = temp_sprite;
	
	GameManager.muted = ! GameManager.muted;
}

function btn_home () {
	Time.timeScale = 1;	
	Application.LoadLevel(1);
}