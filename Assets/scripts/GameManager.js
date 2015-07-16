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
static var part_frequent: float = 1.0; // in second

var leftWall : BoxCollider2D;
var rightWall : BoxCollider2D;

static var isStageMode: boolean;
static var isEndlessMode: boolean;
static var isPlaying: boolean = false;

static var score : int = 0;
static var life : int = 5;
static var drop_speed : float = -400;
static var muted : boolean;

// endless mode
static var maxScore : int = 0;
static var energyBar : int = 0;
static var nextPart : String;
static var isGodMode : boolean = false;
static var GodModeTime : float;

var correctCatchClip : AudioClip;
var correctMissClip : AudioClip;
var lossLifeClip : AudioClip;
static var _correctCatchClip : AudioClip;
static var _correctMissClip : AudioClip;
static var _lossLifeClip : AudioClip;
static var SoundSource : AudioSource;

static var intimes :int = 0;

function Start () {
	intimes ++;

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


// BGM
	MusicControl.PlayGameBGM();
	_correctCatchClip = correctCatchClip;
	_correctMissClip = correctMissClip;
	_lossLifeClip = lossLifeClip;
	SoundSource = gameObject.AddComponent(AudioSource); 
	
	if (GameManager.muted)	{
		MusicControl.Mute();
		SoundSource.mute = true;
	}
	else {
		MusicControl.Unmute();
		SoundSource.mute = false;
	}
	
// time setting
	startTime = Time.time;
	
// 1100 * 618
	leftWall.size = new Vector2(200f, mainCam.ScreenToWorldPoint(new Vector3(0f, 2048f, 0f)).y);;
	leftWall.offset = new Vector2(-618f-100f, 0f);
	
	rightWall.size = new Vector2(200f, mainCam.ScreenToWorldPoint(new Vector3(0f, 2048f, 0f)).y);
	rightWall.offset = new Vector2(618f+100f, 0f);
	
	life = 5;
	score = 0;
	
	if (isEndlessMode) {
		if (PlayerPrefs.HasKey("maxScore")) {
			maxScore = PlayerPrefs.GetInt("maxScore");
		}
		else {
			maxScore = 0;
			PlayerPrefs.SetInt("maxScore", maxScore);
		}
		energyBar = 0;
		nextPart = 'A';
		isGodMode = false;
	}
	isPlaying = true;
	
	if (muted) {
		var l = GameObject.FindGameObjectsWithTag("mute_btn");	
		var temp_sprite : Sprite = l[0].GetComponent(SpriteRenderer).sprite;
		l[0].GetComponent(SpriteRenderer).sprite = l[1].GetComponent(UI.Image).sprite;
		l[1].GetComponent(UI.Image).sprite = temp_sprite;
	}
}

function SetSize(trans : RectTransform , newSize : Vector2) {
    var oldSize = trans.rect.size;
    var deltaSize = newSize - oldSize;
    trans.offsetMin = trans.offsetMin - new Vector2(deltaSize.x * trans.pivot.x, deltaSize.y * trans.pivot.y);
    trans.offsetMax = trans.offsetMax + new Vector2(deltaSize.x * (1f - trans.pivot.x), deltaSize.y * (1f - trans.pivot.y));
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
	
	GameObject.FindGameObjectWithTag("lifeLabel").GetComponent.<UI.Text>().text = 
				String.Format("x{0}", life);
	
	// Endless Mode
	if (isEndlessMode) {
		// draw
		var boxsize = GameObject.FindGameObjectWithTag("Panel").GetComponent.<RectTransform>().rect.size;
		GameObject.FindGameObjectWithTag("Bar").GetComponent.<RectTransform>().sizeDelta = new Vector2((2*energyBar/100f-1) * boxsize.x, boxsize.y);			 
		//Debug.Log(energyBar);
		
		// score vs maxscore
		GameObject.FindGameObjectWithTag("scoreLabel").GetComponent.<UI.Text>().text = 
				String.Format("{0:0000}/{1:0000}", score, maxScore);
		
		// God Mode
		if (isGodMode) {
			var godtime = Time.time - GodModeTime;
			if (godtime > 10) {
				isGodMode = false;
				MusicControl.ChangePitch(1.0);
				drop_speed /= 2f;
			}
			else {
				energyBar = (1f - godtime/10f)*100f;
			}
		}
	}
}


static function energyUp(delta : int) {
	energyBar += delta;
	
	if (energyBar > 100) {
		isGodMode = true;
		MusicControl.ChangePitch(1.3);
		drop_speed *= 2f;
		GodModeTime = Time.time;
	}
}
static function Score (point : float) {
	score += point;
	if (score > maxScore) {
		maxScore = score;
		PlayerPrefs.SetInt("maxScore", maxScore);
	}
}
static function Dead () {
	life--;
	
	SoundSource.volume = 0.2;
	SoundSource.clip = _lossLifeClip;
	SoundSource.Play();
	
	if (life <= 4) {
		GameManager.isPlaying = false;
		
		// prepare
		Time.timeScale = 0;
		if (isEndlessMode) {
			var box = GameObject.FindGameObjectWithTag("EM_Over");
			box.GetComponent(RectTransform).localPosition.z = -3;
			
			var texts = GameObject.FindGameObjectsWithTag("EM_Over_Text");
			texts[0].GetComponent.<UI.Text>().text = String.Format("{0:0000}", maxScore);
			texts[1].GetComponent.<UI.Text>().text = String.Format("times of invincible state: {0:000}", intimes);			
			texts[2].GetComponent.<UI.Text>().text = String.Format("{0:0000}", score);			
		}
		else 
			Application.LoadLevel(5);
	}
}
static function CatchPart(part : String) {
	if (isEndlessMode) { // Endless Mode
		if (isGodMode) { // God Mode			
			SoundSource.volume = 1.0;
			SoundSource.clip = _correctCatchClip;
			SoundSource.Play();	
		
			Score(2.0);
			return;
		}
		if (part[9] != nextPart) { // Endless Mode: Catch wrong
			Debug.Log("catch wrong");
			Dead();
			//nextPart = 'A';
		}
		else { // Endless Mode: Catch correct
			Score(1.0);			
			if (nextPart == 'A') nextPart = 'B';
			else if (nextPart == 'B') nextPart = 'C';
			else if (nextPart == 'C') nextPart = 'D';
			else if (nextPart == 'D') {
				nextPart = 'A';
				Score(4.0); // extra credit
				//energyUp(10);
			}
			
			SoundSource.volume = 1.0;
			SoundSource.clip = _correctCatchClip;
			SoundSource.Play();			
		}
	}
	else { // debug mode
		Score(1.0);
		//Debug.Log("catch"+part[9]);
	}
}
static function MissPart(part : String) {
	if (isEndlessMode) { // Endless Mode
		if (isGodMode) return;
		if (part[9] != nextPart) { // Endless Mode: Miss correct
			Score(1.0);
			energyUp(2);
						
			SoundSource.volume = 1.0;
			SoundSource.clip = _correctMissClip;
			SoundSource.Play();
		}
		else { // Endless Mode: Miss wrong
			Debug.Log("miss wrong");
			Dead();
			//nextPart = 'A';
		}
	}
	else { // debug mode
		Dead();
		//Debug.Log("miss"+part[9]);
	}
}

function OnGUI () {
	//GUI.Label (new Rect (Screen.width/2-120, 3, 100, 100), "Score: " + score);
}






