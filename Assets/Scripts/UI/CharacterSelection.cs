using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CharacterSelection : MonoBehaviour
{
    [SerializeField] private Texture2D[] Characters;
    [SerializeField] private Text inputValue;
    [SerializeField] private Button confirmButton;
    private Toggle selectedCharacter, previousSelected;

    private void Update()
    {
        confirmButton.enabled = inputValue.text != "" && selectedCharacter != null;

        if (Input.GetKeyDown(KeyCode.Escape))
        {
            Cancel();
        }

    }

    public void ClearValues()
    {
        inputValue.text = "";
        selectedCharacter = null;
    }

    public void Cancel()
    {
        ClearValues();
        gameObject.SetActive(false);
    }

    public void Confirm()
    {
        // TODO: chande the character sprite
        ClearValues();
        gameObject.SetActive(false);
    }

    public void Open()
    {
        gameObject.SetActive(true);
    }

    public void SetSelectedCharacter(Toggle btn)
    {
        print("called");
        if(selectedCharacter == btn || previousSelected == btn) return;
        if (selectedCharacter != null){ 
            selectedCharacter.isOn = true;
            previousSelected = selectedCharacter;
        }
        selectedCharacter = btn;
    }
}
