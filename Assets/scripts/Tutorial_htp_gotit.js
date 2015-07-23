#pragma strict

static var n :int;

function Start() {
	n = 1;
}

function OnMouseDown() {
	Destroy(GameObject.Find("tutorial_htp_"+n));
	n++;
	if (n == 4) Destroy(gameObject);
		//Application.LoadLevel(2);
}