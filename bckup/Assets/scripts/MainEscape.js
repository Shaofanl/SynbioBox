#pragma strict

function Update () {
	if (Input.GetKeyDown(KeyCode.Escape)) {
		Application.Quit();
		Debug.Log("exit");
	}
}