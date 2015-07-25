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
static var drop_frequency: float = 1.0; // in second


static var isStageMode: boolean;
static var isEndlessMode: boolean;
static var isPlaying: boolean = false;
static var isPause: boolean = false;
static var isOver: boolean = false;

static var score : int = 0;
static var life : int = 5;
static var drop_speed : float = -400;
static var muted : boolean;

// endless mode
static var max_score : int = 0;
static var energy_bar : int = 0;
static var next_part : String;

// stage mode
static var stage : int = 1;

var correctCatchClip : AudioClip;
var correctMissClip : AudioClip;
var lossLifeClip : AudioClip;
static var _correctCatchClip : AudioClip;
static var _correctMissClip : AudioClip;
static var _lossLifeClip : AudioClip;
static var SoundSource : AudioSource;

// 
static var speed_level : int = 0;
static var acc_alpha :float = 1.5;
static var acc_beta :float = 1.3;
static var isGodMode : boolean = false;
static var GodModeTime : float;
static var god_time_label7 : boolean;
static var god_time_label8 : boolean;
static var god_time_label9 : boolean;

// big label fading
static var fade_time : float;
static var fade_start_time : float;
static var is_fading : boolean = false;


static function prepare_next_part(c : String) {
	next_part = c;
	
	if (isStageMode) {
		if (c == 'A') {
			GameObject.Find("lv1_gained_1").GetComponent.<SpriteRenderer>().color.a = 
			GameObject.Find("lv1_gained_2").GetComponent.<SpriteRenderer>().color.a = 
			GameObject.Find("lv1_gained_3").GetComponent.<SpriteRenderer>().color.a = 
			GameObject.Find("lv1_gained_4").GetComponent.<SpriteRenderer>().color.a = 0.3;
		}
		else if (c == 'B'){
			GameObject.Find("lv1_gained_1").GetComponent.<SpriteRenderer>().color.a = 1.0;
		}
		else if (c == 'C'){
			GameObject.Find("lv1_gained_2").GetComponent.<SpriteRenderer>().color.a = 1.0;
		}
		else if (c == 'D'){
			GameObject.Find("lv1_gained_3").GetComponent.<SpriteRenderer>().color.a = 1.0;
		}
	}
	
	/*
	var main = GameObject.Find("Tip_main").GetComponent.<SpriteRenderer>();
	
	var tips = GameObject.FindGameObjectsWithTag("Tips");
	if (c == 'A') main.sprite = tips[1].GetComponent.<SpriteRenderer>().sprite; // 0
	if (c == 'B') main.sprite = tips[3].GetComponent.<SpriteRenderer>().sprite; // 1
	if (c == 'C') main.sprite = tips[2].GetComponent.<SpriteRenderer>().sprite; // 2
	if (c == 'D') main.sprite = tips[0].GetComponent.<SpriteRenderer>().sprite; // 3
	*/
}

static function BigLabelFade(ft : float, s : String) {
	fade_time = ft;
	fade_start_time = Time.time;
	is_fading = true;
	var l = GameObject.Find("biglabel").GetComponent.<UI.Text>();
	l.text = s;
	l.fontSize = 200;
	l.color.a = 1.0;
}
function BigLabelFading() {
	if (!is_fading) return;
	
	var passed = Time.time - fade_start_time;
	if (passed > fade_time) {
		is_fading = false;
		return;
	}
	else {
		var l = GameObject.Find("biglabel").GetComponent.<UI.Text>();
		l.color.a = 1.0 - passed/fade_time;
		l.fontSize = 200 + 20*passed/fade_time;
	}
}

function Start () {
	PlayerPrefs.SetInt("em_need_help", 0);//doesn't need tutorial
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
	/*leftWall.size = new Vector2(200f, mainCam.ScreenToWorldPoint(new Vector3(0f, 2048f, 0f)).y);;
	leftWall.offset = new Vector2(-618f-100f, 0f);
	
	rightWall.size = new Vector2(200f, mainCam.ScreenToWorldPoint(new Vector3(0f, 2048f, 0f)).y);
	rightWall.offset = new Vector2(618f+100f, 0f);
	*/
	
	life = 5;
	score = 0;
	drop_frequency = 1.0;
	drop_speed = -400;
	
	if (isEndlessMode) {
		if (PlayerPrefs.HasKey("max_score")) {
			max_score = PlayerPrefs.GetInt("max_score");
		}
		else {
			max_score = 0;
			PlayerPrefs.SetInt("max_score", max_score);
		}
		energy_bar = 0;
		prepare_next_part('A');
		isGodMode = false;
		speed_level = 1;
		GameObject.Find("Lv").GetComponent.<UI.Text>().text="Lv1";
		GameObject.Find("ScorePanel").GetComponent.<RectTransform>().position.z = 0;
		GameObject.Find("em_background").GetComponent.<Transform>().position.z = 8;		
		GameObject.Find("em_background").GetComponent.<Transform>().position.x = 0;
		GameObject.Find("scoreLabel").GetComponent.<RectTransform>().position.z = 0;
	}
	
	if (isStageMode) {
		prepare_next_part('A');
		GameObject.Find("Lv").GetComponent.<UI.Text>().text="Lv"+stage;
	}	
	
	isPlaying = true;
	isPause = false;
	isOver = false;
	
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
	BigLabelFading();
	if (Input.GetKeyDown(KeyCode.Escape)) { // Escape is top-priority
		var box = GameObject.FindGameObjectWithTag("Pause");
		if (isPlaying) {
			Time.timeScale = 0;
			box.GetComponent(RectTransform).localPosition.z = -3;
			isPlaying = false;
			isPause = true;
		} else if (isPause) {
			box.GetComponent(RectTransform).localPosition.z = -100;
			Time.timeScale = 1;	
			isPause = false;
			isPlaying = true;
		} else if (isOver) {
			Time.timeScale = 1;	
			Application.LoadLevel(1);
			MusicControl.PlayMainBGM();
			
			GameManager.isOver = false;
			GameManager.isPlaying = false;	
		}
	}
	
	if (!isPlaying) return;
	
	var guiTime = Time.time - startTime;
	
	// create part
	if (guiTime - last_part_time > drop_frequency+Random.Range(-drop_frequency*0.3, drop_frequency*0.3)) {
		last_part_time = guiTime;
		
		var part;
		var pos: float = Random.Range(-550, 550);
		if (isStageMode && Random.Range(0f, 1f) < 0.10) {
			part = GameObject.Find("stage_"+stage);
		}
		else {	
			var part_no : int = Random.Range(0, 4);
			var part_color : int = Random.Range(0, 8);			
			
			part = GameObject.FindGameObjectsWithTag("Part"+part_no)[part_color];
		}
		Instantiate(part, Vector3(pos, 1100f, 0f), Quaternion.identity);
	}
	
	GameObject.FindGameObjectWithTag("lifeLabel").GetComponent.<UI.Text>().text = 
				String.Format("x{0}", life);
	
	
	
	// Endless Mode
	if (isEndlessMode) {
		// draw
		var boxsize = GameObject.Find("ScorePanel").GetComponent.<RectTransform>().rect.size;
		GameObject.Find("ScoreBar").GetComponent.<RectTransform>().sizeDelta = new Vector2((2*energy_bar/100f-1) * boxsize.x, boxsize.y);			 
		//Debug.Log(energy_bar);
		
		// score vs maxscore
		GameObject.FindGameObjectWithTag("scoreLabel").GetComponent.<UI.Text>().text = 
				String.Format("{0:0000}/{1:0000}", score, max_score);
		
		// God Mode
		if (isGodMode) {
			var godtime = Time.time - GodModeTime;
			if (godtime >= 7 && god_time_label7) {
				BigLabelFade(0.8, "3");
				god_time_label7 = false;
			} 
			if (godtime >= 8 && god_time_label8) {
				BigLabelFade(0.8, "2");
				god_time_label8 = false;
			} 			
			if (godtime >= 9 && god_time_label9) {
				BigLabelFade(0.8, "1");
				god_time_label9 = false;
			} 			
			if (godtime > 10) {
				isGodMode = false;
				
				MusicControl.ChangePitch(1.0);
				drop_speed = drop_speed/acc_alpha*acc_beta;
				drop_frequency = drop_frequency*acc_alpha/acc_beta;
				BoxControl.speed = BoxControl.speed/acc_alpha*acc_beta;
			}
			else {
				energy_bar = (1f - godtime/10f)*100f;
			}
		}
	}
	
	
	// Stage Mode
	if (isStageMode) {
	}
}


static function energyUp(delta : int) {
	energy_bar += delta;
	
	if (energy_bar >= 100) {
		isGodMode = true;
		prepare_next_part('A');
		
		god_time_label9 = true;
		god_time_label8 = true;
		god_time_label7 = true;
		BigLabelFade(1.0, "Invincible!");
		
		speed_level += 1;		
		GameObject.Find("Lv").GetComponent.<UI.Text>().text="Lv"+speed_level;
		MusicControl.ChangePitch(1.2);
		drop_speed *= acc_alpha;
		drop_frequency /= acc_alpha;
		BoxControl.speed *= acc_alpha;	
				
		GodModeTime = Time.time;
	}
}
static function Score (point : float) {
	score += point;
	if (score > max_score) {
		max_score = score;
		PlayerPrefs.SetInt("max_score", max_score);
	}
}
static function Dead () {
	life--;
	
	SoundSource.volume = 0.05;
	SoundSource.clip = _lossLifeClip;
	SoundSource.Play();
	
	if (life <= 0) {
		GameManager.isPlaying = false;
		
		// prepare
		Time.timeScale = 0;
		if (isEndlessMode) {
			var box = GameObject.FindGameObjectWithTag("EM_Over");
			box.GetComponent(RectTransform).localPosition.z = -3;
			GameManager.isOver = true;
			GameManager.isPlaying = false;
			
			var texts = GameObject.FindGameObjectsWithTag("EM_Over_Text");		
			texts[2].GetComponent.<UI.Text>().text = String.Format("{0}", score);						
			texts[0].GetComponent.<UI.Text>().text = String.Format("{0}", max_score);
			texts[1].GetComponent.<UI.Text>().text = String.Format("Speed level: {0}", speed_level);	
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
		if (part[9] != next_part) { // Endless Mode: Catch wrong
			Debug.Log("catch wrong");
			Dead();
			//next_part = 'A';
		}
		else { // Endless Mode: Catch correct
			Score(1.0);			
			if (next_part == 'A') prepare_next_part('B');
			else if (next_part == 'B') prepare_next_part('C');
			else if (next_part == 'C') prepare_next_part('D');
			else if (next_part == 'D') {	
				prepare_next_part('A');
				Score(4.0); // extra credit
				energyUp(50);
			}
			
			SoundSource.volume = 1.0;
			SoundSource.clip = _correctCatchClip;
			SoundSource.Play();			
		}
	}
	else if (isStageMode) {
		SoundSource.volume = 1.0;
		SoundSource.clip = _correctCatchClip;
		SoundSource.Play();	
		
		if (part == GameObject.Find("stage_"+stage).name) {
			// next level
			prepare_next_part('D');
		}
		else if (part[9] != next_part) { // normal part and catching wrong
			Debug.Log("catch wrong");
			Dead();
			//next_part = 'A';
		}
		else { // normal part and catching right
			if (next_part == 'A') prepare_next_part('B');
			else if (next_part == 'B') prepare_next_part('C');
			else if (next_part == 'C') prepare_next_part('D');
			else if (next_part == 'D') prepare_next_part('A');
			
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
		if (part[9] != next_part) { // Endless Mode: Miss correct
			Score(1.0);
			energyUp(2);
						
			SoundSource.volume = 1.0;
			SoundSource.clip = _correctMissClip;
			SoundSource.Play();
		}
		else { // Endless Mode: Miss wrong
			Debug.Log("miss wrong");
			Dead();
			//next_part = 'A';
		}
	}
	else if (isStageMode) {
		if (part == GameObject.Find("stage_"+stage).name) {
			if (next_part == 'C') 
				Dead();
			else {				
				SoundSource.volume = 1.0;
				SoundSource.clip = _correctMissClip;
				SoundSource.Play();
			}
		}
		else { // normal part
			if (part[9] != next_part) {
				SoundSource.volume = 1.0;
				SoundSource.clip = _correctMissClip;
				SoundSource.Play();
			}
			else {
				Dead();
			}
		}
		
		
	}
	else { // debug mode
		Dead();
		//Debug.Log("miss"+part[9]);
	}
}

function OnGUI () {
	//GUI.Label (new Rect (Screen.width/2-120, 3, 100, 100), "Score: " + score);
	//GUI.Label (new Rect (Screen.width/2, 3, 300, 300), "x: " + BoxControl.boxx);
	//GUI.Label (new Rect (Screen.width/2, 10, 300, 300), "x: " + BoxControl.touchx);
}






