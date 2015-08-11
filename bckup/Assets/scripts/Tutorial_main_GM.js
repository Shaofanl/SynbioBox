#pragma strict

function Start(){
	var em_need_help = PlayerPrefs.GetInt("em_need_help");
	if (em_need_help == 1) {
		GameObject.Find("tutorial_on_off").GetComponent.<SpriteRenderer>().sprite = 
			GameObject.Find("tutorial_on").GetComponent.<SpriteRenderer>().sprite;
	}
	else {
		GameObject.Find("tutorial_on_off").GetComponent.<SpriteRenderer>().sprite = 
			GameObject.Find("tutorial_off").GetComponent.<SpriteRenderer>().sprite;
	}
}

function Update () {
	if (Input.GetKeyDown(KeyCode.Escape))
		Application.LoadLevel(1);
}