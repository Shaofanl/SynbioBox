#pragma strict

static var n :int;

function Start() {
	n = 0;
}

function OnMouseDown() {
	Destroy(GameObject.Find("tutorial_mb_"+n));
	n++;
	if (n == 7 && EM_tutorial_control.in_tutorial == false)
		Destroy(gameObject);
	else if (n == 8)
		Application.LoadLevel(8);
	//Application.LoadLevel(2);

}