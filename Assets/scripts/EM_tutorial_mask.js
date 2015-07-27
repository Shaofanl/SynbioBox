#pragma strict

var left_arrow : KeyCode;
var right_arrow : KeyCode;

static function next() {
	if (EM_tutorial_specpart.current_mask == 4) {
		EM_tutorial_specpart.load_mask(5);
	}
	else if (EM_tutorial_specpart.current_mask == 5) {
		EM_tutorial_specpart.load_mask(6);
	}
	else if (EM_tutorial_specpart.current_mask == 7) {
		EM_tutorial_specpart.load_mask(8);
	}
	else if (EM_tutorial_specpart.current_mask == 8) {
		Application.LoadLevel(4);
	}
	else {
		GameObject.Find("mask").GetComponent.<Transform>().position.z = -100;
		Time.timeScale = 1;
	}
}

function Update() {	
	if (Time.timeScale == 0) {
		if ( Input.GetKeyDown(left_arrow) || Input.GetKeyDown(right_arrow) ) {
			next();
		}
	}
}

function OnMouseDown() {
	next();
}