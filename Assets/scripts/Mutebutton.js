#pragma strict

static var muted : boolean = false;

function Start () {
	muted = false;
}

function OnMouseDown () {	
	var l = GameObject.FindGameObjectsWithTag("mute_btn");	
	if (muted) {
		muted = false;
		l[0].GetComponent.<SpriteRenderer>().color = Vector4(1f,1f,1f,1f);
		l[1].GetComponent.<SpriteRenderer>().color = Vector4(1f,1f,1f,0f);		
	}
	else {
		muted = true;	
		l[0].GetComponent.<SpriteRenderer>().color = Vector4(1f,1f,1f,0f);
		l[1].GetComponent.<SpriteRenderer>().color = Vector4(1f,1f,1f,1f);		
	}
}

function Update () {

}