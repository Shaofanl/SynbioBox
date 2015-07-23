#pragma strict

static var n :int;

function Start() {
	n = 0;
}

function OnMouseDown() {
	Destroy(GameObject.Find("tutorial_mb_"+n));
	n++;
	if (n == 7) Destroy(gameObject);
		//Application.LoadLevel(2);
}