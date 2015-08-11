#pragma strict

var mainCam : Camera;

var bg_box : Transform;
var bg_down : Transform;

var startTime : float;
var last_part_time : float;
static var drop_frequency: float = 1.0; // in second

static var score : int = 0;
static var drop_speed : float = -400;

// tutorial
static var energy_bar : int = 0;
static var next_part : String;
static var dropped_part : int = 0;
static var avoid_part : int = 0;
static var in_tutorial: boolean = true;

// sounds
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
	
	var main = GameObject.Find("Tips").GetComponent.<UI.Text>();
	if (c == 'A') main.text = "Next: Promoter"; // 0
	if (c == 'B') main.text = "Next: RBS"; // 1
	if (c == 'C') main.text = "Next: CDS"; // 2
	if (c == 'D') main.text = "Next: Terminator"; // 3	
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
	Time.timeScale = 1;	
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
	
	score = 0;
	drop_frequency = 1.0;
	drop_speed = -400;
	
	dropped_part = 0;
	avoid_part = 0;
	
	energy_bar = 0;
	prepare_next_part('A');
	isGodMode = false;
	speed_level = 1;
	GameObject.Find("Lv").GetComponent.<UI.Text>().text="Lv1";
	GameObject.Find("ScorePanel").GetComponent.<RectTransform>().position.z = 0;
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
		Application.LoadLevel(1);
	}
	
	var guiTime = Time.time - startTime;
	
	// create part
	if (guiTime - last_part_time > drop_frequency) {
		last_part_time = guiTime;
		
		var part : GameObject;
		var pos : float;
		if (dropped_part == 0) {
			pos = -395f;
			part = GameObject.Find("spec_partA");
			avoid_part++;
		}
		else if (dropped_part == 8) {
			pos = 254;
			part = GameObject.Find("spec_partB");
			avoid_part++;
		}
		else if (dropped_part == 17) {
			pos = -403;
			part = GameObject.Find("spec_partC");
			avoid_part++;
		}
		else if (dropped_part == 24) {
			pos =  362;
			part = GameObject.Find("spec_partD");
			avoid_part++;
		}		
		else if (dropped_part == 40) {
			pos = -401;
			part = GameObject.Find("spec_partE");
			avoid_part++;
		}		
		else {
			pos = Random.Range(-550, 550);
			var part_no : int = Random.Range(0, 4);
			while (part_no == avoid_part) part_no = Random.Range(0, 4);
			var part_color : int = Random.Range(0, 8);			
			
			part = GameObject.FindGameObjectsWithTag("Part"+part_no)[part_color];
		}
		Instantiate(part, Vector3(pos, 1100f, 0f), Quaternion.identity);
		
		dropped_part ++;
	}
	
	
	// Endless Mode
		// draw
		var boxsize = GameObject.Find("ScorePanel").GetComponent.<RectTransform>().rect.size;
		GameObject.Find("ScoreBar").GetComponent.<RectTransform>().sizeDelta = new Vector2((2*energy_bar/100f-1) * boxsize.x, boxsize.y);			 
		//Debug.Log(energy_bar);
		
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
				prepare_next_part('A');
				
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


static function energyUp(delta : int) {
	energy_bar += delta;
	
	if (energy_bar >= 100) {
		isGodMode = true;
		GameObject.Find("Tips").GetComponent.<UI.Text>().text = 'Anything';
		
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
}
static function Dead () {
	SoundSource.volume = 0.05;
	SoundSource.clip = _lossLifeClip;
	SoundSource.Play();
	
	Application.LoadLevel(8);
}



static function CatchPart(part : String) {
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
			energyUp(4);		
			if (next_part == 'A') prepare_next_part('B');
			else if (next_part == 'B') prepare_next_part('C');
			else if (next_part == 'C') prepare_next_part('D');
			else if (next_part == 'D') {	
				prepare_next_part('A');
				Score(4.0); // extra credit
				//energyUp(50);
			}
			
			SoundSource.volume = 1.0;
			SoundSource.clip = _correctCatchClip;
			SoundSource.Play();			
		}
}
static function MissPart(part : String) {
		if (isGodMode) return;
		if (part[9] != next_part) { // Endless Mode: Miss correct
			Score(1.0);
			energyUp(4);
						
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

function OnGUI () {
	//GUI.Label (new Rect (Screen.width/2-120, 3, 100, 100), "Score: " + score);
	//GUI.Label (new Rect (Screen.width/2, 3, 300, 300), "x: " + BoxControl.boxx);
	//GUI.Label (new Rect (Screen.width/2, 10, 300, 300), "x: " + BoxControl.touchx);
}






