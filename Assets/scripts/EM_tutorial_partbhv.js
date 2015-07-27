#pragma strict

function Update () {
	GetComponent.<Rigidbody2D>().velocity.y = EM_tutorial_control.drop_speed;
}

function OnCollisionEnter2D(colInfo : Collision2D) {
	if (colInfo.collider.tag == "Box") {
		//Debug.Log("box");
		EM_tutorial_control.CatchPart(GetComponent.<Transform>().name);
		Destroy (gameObject);
	}
	else if (colInfo.collider.tag == "Down") {
		//Debug.Log("down");		
		EM_tutorial_control.MissPart(GetComponent.<Transform>().name);
		Destroy (gameObject);		
	}
}