#pragma strict

static var arr = new Array ();

function Start() {
	arr.clear();
}

function Update () {
	if (transform.position.z < 0) return; // skip the father
	if (transform.position.y < -693 && !(name in arr)) {
		Debug.Log(name);
		arr.push(name);
		
		GameObject.Find("mask").GetComponent.<Transform>().position.z = -1;
		
		Time.timeScale = 0;
	}
}