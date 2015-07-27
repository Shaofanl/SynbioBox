#pragma strict

static var arr = new Array ();
static var current_mask : int;

function Start() {
	arr.clear();
	current_mask = 0;
}

static function load_mask(i : int) {
	GameObject.Find("mask").GetComponent.<SpriteRenderer>().sprite = 
			GameObject.Find("mask_"+i).GetComponent.<SpriteRenderer>().sprite;
	GameObject.Find("mask").GetComponent.<Transform>().position.z = -1;
	current_mask = i;
}

function Update () {
	if (transform.position.z < 0) return; // skip the father
	if (name[9] == 'A' && transform.position.y < 413 && !(name in arr)) {
		arr.push(name);
		load_mask(1);
		Time.timeScale = 0;
	}
	else if (name[9] == 'B' && transform.position.y < 14 && !(name in arr)) {
		arr.push(name);
		load_mask(2);
		Time.timeScale = 0;
	}
	else if (name[9] == 'C' && transform.position.y < -239.4 && !(name in arr)) {
		arr.push(name);
		load_mask(3);
		Time.timeScale = 0;
	}
	else if (name[9] == 'D' && transform.position.y < 364 && !(name in arr)) {
		arr.push(name);
		load_mask(4);
		Time.timeScale = 0;
	}
	else if (name[9] == 'E' && transform.position.y < 406 && !(name in arr)) {
		arr.push(name);
		load_mask(7);
		Time.timeScale = 0;
	}
}