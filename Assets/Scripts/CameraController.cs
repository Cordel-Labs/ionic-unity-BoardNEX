using System.Collections;
using System.Collections.Generic;
// using UnityEditor.Experimental.GraphView;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    private bool isDragging = false;
    private float mouseStartX, mouseStartY;
    [SerializeField] private BoardController bc;
        
    void Update()
    {
        if (Input.mouseScrollDelta.y > 0 && Camera.main.orthographicSize > 1 && !bc.MouseAboveCanva())
        {
            Camera.main.orthographicSize -= .5f;
        }
        else if (Input.mouseScrollDelta.y < 0 && Camera.main.orthographicSize < 21 && !bc.MouseAboveCanva())
        {
            Camera.main.orthographicSize += .5f;
        }

        if (Input.GetMouseButtonDown(2))
        {
            isDragging = true;
            mouseStartX = Input.mousePosition.x;
            mouseStartY = Input.mousePosition.y;
        }
        
        if (Input.GetMouseButtonUp(2))
        {
            isDragging = false;
        }

        if (isDragging)
        {
            if (Input.mousePosition.x != mouseStartX)
            {
                var difference = (Input.mousePosition.x - mouseStartX) / 80;
                var positionUpdate = difference > 0 ? transform.position.x - difference : transform.position.x + -difference;
                transform.position = new Vector3(positionUpdate, transform.position.y, -10);
                mouseStartX = Input.mousePosition.x;
            }
            
            if (Input.mousePosition.y != mouseStartY)
            {
                var difference = (Input.mousePosition.y - mouseStartY) / 80;
                var positionUpdate = difference > 0 ? transform.position.y - difference : transform.position.y + -difference;
                transform.position = new Vector3(transform.position.x, positionUpdate, -10);
                mouseStartY = Input.mousePosition.y;
            }
        }
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
