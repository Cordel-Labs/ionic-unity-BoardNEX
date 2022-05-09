using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PanelsNavigation : MonoBehaviour
{
    private int currentPanel = 0;
    [SerializeField] GameObject[] panels;
    [SerializeField] private Image[] buttons;
    [SerializeField] private Color selectedColor;
    [SerializeField] private Animator containerAnimator;
    private bool active = true;

    private void Start()
    {
        selectedColor.a = 1;
        buttons[currentPanel].color = selectedColor;
    }

    public void ChangePanel(int index)
    {
        buttons[currentPanel].color = Color.white;
        panels[currentPanel].GetComponent<Animator>().SetBool("active", false);
        currentPanel = index;
        buttons[currentPanel].color = selectedColor;
        panels[currentPanel].GetComponent<Animator>().SetBool("active", true);
    }

    public void toggleUI()
    {
        active = !active;
        containerAnimator.SetBool("active", active);
    }
}
