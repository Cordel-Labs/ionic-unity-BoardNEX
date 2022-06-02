using System;
using System.Runtime.InteropServices;
using UnityEngine;
using UnityEngine.UI;

public class FirebaseManager : MonoBehaviour{
    public static FirebaseManager Instance;

    void Start(){
        if(Instance == null){
            Instance = this;
        }
        else{
            Destroy(gameObject);
        }
    }

    [DllImport("__Internal")]
    public static extern void GetJSON(string path, string name, string callback, string fallback);

    [DllImport("__Internal")]
    public static extern void PostJSON(string path, string value, string name, string callback, string fallback);

    [DllImport("__Internal")]
    public static extern void WindowMessage(string message);

    public void PostData(string path, string data, string name){
        string realData = "\"" + data + "\"";
        PostJSON(path, realData, name, "CallbackFunc", "FallbackFunc");
    }

    public void GetData(string path, string name){
        GetJSON(path, name, "CallbackFunc", "FallbackFunc");
    }

    private void CallbackFunc(string message){
        Debug.Log(message);
    }

    private void FallbackFunc(string err){
        Debug.Log(err);
    }
}
