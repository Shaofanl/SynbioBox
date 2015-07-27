#pragma strict

function Start () {

}

function Update () {
	GetComponent.<Rigidbody2D>().velocity.y = GameManager.drop_speed;
}

function OnCollisionEnter2D(colInfo : Collision2D) {
	if (colInfo.collider.tag == "Box") {
		GameManager.CatchFunPart(GetComponent.<Transform>().name);
		//GameManager.Score(1.0);
		Destroy (gameObject);
	}
	else if (colInfo.collider.tag == "Down") {
		Destroy (gameObject);		
	}
}