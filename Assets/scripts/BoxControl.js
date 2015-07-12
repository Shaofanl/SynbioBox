#pragma strict

var leftKey: KeyCode;
var rightKey: KeyCode;
var speed : float;

function Start () {
	
}

function Update () {
	if (Input.GetKey(leftKey)) {
		GetComponent.<Rigidbody2D>().velocity.x = -speed;
	}
	else if (Input.GetKey(rightKey)) {
		GetComponent.<Rigidbody2D>().velocity.x = speed;
	}
	else {
	/*	if (GetComponent.<Rigidbody2D>().velocity.x > 0)
			GetComponent.<Rigidbody2D>().velocity.x --;
		else if (GetComponent.<Rigidbody2D>().velocity.x < 0)
			GetComponent.<Rigidbody2D>().velocity.x ++;
	*/
		GetComponent.<Rigidbody2D>().velocity.x = 0;
	}
}