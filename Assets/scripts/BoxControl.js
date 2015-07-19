#pragma strict

var leftKey: KeyCode;
var rightKey: KeyCode;
static var speed : float;
var touchSpeedAlpha : float;

// debug
//static var boxx : float;
//static var touchx : float;

function Start () {
	speed = 1000;
	touchSpeedAlpha = 6.0/speed;
}

function Update () {
	if (GameManager.isPlaying) {
		if (Input.GetKey(leftKey)) {
			GetComponent.<Rigidbody2D>().velocity.x = -speed;
		}
		else if (Input.GetKey(rightKey)) {
			GetComponent.<Rigidbody2D>().velocity.x = speed;
		}
		else if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Moved) {		
			var touchDeltaPosition : Vector2 = Input.GetTouch(0).deltaPosition;
			transform.Translate(touchDeltaPosition.x * touchSpeedAlpha * speed, 0, 0);
			
			//var touchPosition : Vector2 = Input.GetTouch(0).position;
			//touchPosition = GameObject.FindGameObjectWithTag("MainCamera").GetComponent.<Camera>().ScreenToWorldPoint(touchPosition);
			//touchx = touchPosition.x;
			//GetComponent.<Rigidbody2D>().position.x = touchPosition.x-1;//343/2
			
		}
		else {
		/*	var slowRate : float = speed/2;
			if (GetComponent.<Rigidbody2D>().velocity.x > 0)
				GetComponent.<Rigidbody2D>().velocity.x -= slowRate;
			else if (GetComponent.<Rigidbody2D>().velocity.x < 0)
				GetComponent.<Rigidbody2D>().velocity.x += slowRate;
		*/
			GetComponent.<Rigidbody2D>().velocity.x = 0;
		}
	}
	if (GetComponent.<Rigidbody2D>().position.x < -639) {
		GetComponent.<Rigidbody2D>().position.x = -639;
	}
	if (GetComponent.<Rigidbody2D>().position.x > 639) {
		GetComponent.<Rigidbody2D>().position.x = 639;
	}
	
	//boxx = 	GetComponent.<Rigidbody2D>().position.x;
}