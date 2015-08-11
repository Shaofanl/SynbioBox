#pragma strict

function OnMouseDown () {
	// PlayerPrefs.Save(); automatically
	Time.timeScale = 0;
	var box = GameObject.FindGameObjectWithTag("Pause");
	box.GetComponent(RectTransform).localPosition.z = -3;
	
	GameManager.isPause = true;
	GameManager.isPlaying = false;
}

