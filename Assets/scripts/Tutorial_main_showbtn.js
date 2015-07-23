#pragma strict

function OnMouseDown() {
	var em_need_help = PlayerPrefs.GetInt("em_need_help");
	em_need_help = 1 - em_need_help;
	PlayerPrefs.SetInt("em_need_help", em_need_help);
	if (em_need_help == 1) {
		GameObject.Find("tutorial_on_off").GetComponent.<SpriteRenderer>().sprite = 
			GameObject.Find("tutorial_on").GetComponent.<SpriteRenderer>().sprite;
	}
	else {
		GameObject.Find("tutorial_on_off").GetComponent.<SpriteRenderer>().sprite = 
			GameObject.Find("tutorial_off").GetComponent.<SpriteRenderer>().sprite;
	}
}