#pragma strict

static var n :int;
static var l = [1, 6, 5, 0, 4, 3, 2];

function Start() {
	n = 1;
}

function OnMouseDown() {
	Destroy(GameObject.Find("tutorial_mb_"+n));
	n++;
	if (n == 8)
		Application.LoadLevel(2);
}