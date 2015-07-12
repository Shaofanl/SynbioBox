#pragma strict



function Start () {
	var drop_speed : float = 700;
	GetComponent.<Rigidbody2D>().velocity.y = -drop_speed;
}

function Update () {
	
}

function OnCollisionEnter2D(colInfo : Collision2D) {
	if (colInfo.collider.tag == "Box") {
		//Debug.Log("box");
		GameManager.Score(1.0);
		Destroy (gameObject);
	}
	else if (colInfo.collider.tag == "Down") {
		//Debug.Log("down");
		GameManager.Dead();
		Destroy (gameObject);		
	}
}