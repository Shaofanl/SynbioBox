#pragma strict

static var SoundSource : AudioSource;
static var MainBGM : AudioClip;
static var GameBGM : AudioClip;
var MainBGMClip : AudioClip;
var GameBGMClip : AudioClip;

function Awake() { 
	DontDestroyOnLoad(gameObject); 
	SoundSource = gameObject.AddComponent(AudioSource); 
	//SoundSource.playOnAwake = false; 
	//SoundSource.rolloffMode = AudioRolloffMode.Logarithmic; 
	SoundSource.loop = true; 
	
	MainBGM = MainBGMClip;
	GameBGM = GameBGMClip;
}

static function Mute() {
	SoundSource.mute = true;
}

static function Unmute() {
	SoundSource.mute = false;
}

static function ChangePitch(p : float) {
	SoundSource.pitch = p;
}

static function PlayMainBGM() { 
	//Debug.Log("asdf");
	SoundSource.clip = MainBGM; 
	SoundSource.Play(); 
}

static function PlayGameBGM() {
	SoundSource.clip = GameBGM;
	SoundSource.Play(); 
}