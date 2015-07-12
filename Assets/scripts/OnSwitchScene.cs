using UnityEngine;
using System.Collections;

public class OnSwitchScene : MonoBehaviour {

	public void LoadScene(int Level) {
		Application.LoadLevel(Level);
	}

	public void Quit() {
		Application.Quit ();
	}
}
