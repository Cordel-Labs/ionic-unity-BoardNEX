using System.Collections;
using System.Collections.Generic;
using UnityEditor.Experimental.GraphView;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    void Update()
    {
    }

    public void Zoom(string type)
    {
        if (!Camera.main) return;
        
        switch (type)
        {
            case "out" when Camera.main.orthographicSize < 21:
                Camera.main.orthographicSize += 1;
                return;
            case "in" when Camera.main.orthographicSize > 2:
                Camera.main.orthographicSize -= 1;
                break;
        }
    }
}
