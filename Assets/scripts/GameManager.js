#pragma strict

var mainCam : Camera;

var bg_background : Transform;
var bg_pause : Transform;
var bg_life : Transform;
var bg_box : Transform;
var bg_lvx : Transform;
var bg_down : Transform;

var startTime : float;
var last_part_time : float;
var part_frequent: float; // in second

var leftWall : BoxCollider2D;
var rightWall : BoxCollider2D;

static var isStageMode: boolean;
static var isEndlessMode: boolean;
static var isPlaying: boolean = false;

static var score : int = 0;
static var maxscore : int = 0;
static var life : int = 5;


function Start () {

// part positions
	/*
		game_box y=229 148*71
		game_charge x=621 y=86 900*60
		game_down x=621 y=86 1242*171
		game_life x=1058 y=2128 102*102
		game_LvX x=86 y=86 171*169
		game_pause x=1160 y=86 168*169
	*/	
//	bg_box.position = new Vector3(0f, 229f, 0f);

// time setting
	startTime = Time.time;
	
// 1100 * 618
	leftWall.size = new Vector2(200f, mainCam.ScreenToWorldPoint(new Vector3(0f, 2048f, 0f)).y);;
	leftWall.offset = new Vector2(-618f-100f, 0f);
	
	rightWall.size = new Vector2(200f, mainCam.ScreenToWorldPoint(new Vector3(0f, 2048f, 0f)).y);
	rightWall.offset = new Vector2(618f+100f, 0f);
	
	life = 5;
	score = 0;
	if (PlayerPrefs.HasKey("MaxScore")) {
		maxscore = PlayerPrefs.GetInt("MaxScore");
	}
	else {
		maxscore = 0;
		PlayerPrefs.SetInt("MaxScore", maxscore);
	}
	isPlaying = true;
}

function Update () {
	if (!isPlaying) return;
	var guiTime = Time.time - startTime;
	
	if (guiTime - last_part_time > part_frequent+Random.Range(-0.3, 0.3)) {
		last_part_time = guiTime;
				
		var part_no : int = Random.Range(0, 4);
		var part_color : int = Random.Range(0, 8);
		var pos: float = Random.Range(-550, 550);
		
		var part = GameObject.FindGameObjectsWithTag("Part"+part_no)[part_color];		
		Instantiate(part, Vector3(pos, 1100f, 0f), Quaternion.identity);
	}
}

static function Score (point : float) {
	score += point;
	if (score > maxscore) {
		maxscore = score;
		PlayerPrefs.SetInt("MaxScore", maxscore);
	}
}
static function Dead () {
	life--;
	if (life <= 0) {
		GameManager.isPlaying = false;
		Application.LoadLevel(5);
	}
}

function OnGUI () {
	//GUI.Label (new Rect (Screen.width/2-120, 3, 100, 100), "Score: " + score);
	GameObject.FindGameObjectWithTag("scoreLabel").GetComponent.<UI.Text>().text = 
			String.Format("{0:0000}/{1:0000}", score, maxscore);
	GameObject.FindGameObjectWithTag("lifeLabel").GetComponent.<UI.Text>().text = 
			String.Format("X {0}", life);
}

