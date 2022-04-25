using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PanelsNavigation : MonoBehaviour
{
    private int currentPanel = 0;
    [SerializeField] GameObject[] panels;
    [SerializeField] private Animator containerAnimator;
    private bool active = true;

    public void confirm()
    {
        panels[currentPanel].GetComponent<Animator>().SetBool("active", false);
        var hasNext = currentPanel == panels.Length - 1;
        currentPanel = hasNext ? 0 : currentPanel + 1;
        panels[currentPanel].GetComponent<Animator>().SetBool("active", true);
    }
    
    public void delete()
    {
        if (currentPanel < 1) return;

        panels[currentPanel].GetComponent<Animator>().SetBool("active", false);
        currentPanel--;
        panels[currentPanel].GetComponent<Animator>().SetBool("active", true);
    }

    public void toggleUI()
    {
        active = !active;
        containerAnimator.SetBool("active", active);
    }
}
