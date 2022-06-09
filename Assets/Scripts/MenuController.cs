using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MenuController : MonoBehaviour
{
    void Awake(){
#if !UNITY_EDITOR && UNITY_WEBGL
        WebGLInput.captureAllKeyboardInput = false;
#endif
    }

    public void EnterBoard() {
        SceneManager.LoadScene(1);
    }

    public void ExitGame()
    {
        FirebaseManager.WindowMessage("leaveEditor");
        // Application.Quit();
    }
}
