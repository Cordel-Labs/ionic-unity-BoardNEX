using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CharacterSelection : MonoBehaviour
{
    [SerializeField] private Texture2D[] Characters;
    [SerializeField] private InputField input;
    [SerializeField] private Button confirmButton;
    private Toggle selectedCharacter, previousSelected;
    // private bool writing = false;

    private void Update()
    {
        confirmButton.enabled = input.text != "" && selectedCharacter != null;

        if (Input.GetKeyDown(KeyCode.Escape))
        {
            Cancel();
        }
    }

    public void LooseFocus(){
        print("Loose focus");
    }

    public void ClearValues()
    {
        input.text = "";
        if(selectedCharacter != null){
            selectedCharacter.interactable = true;
            selectedCharacter.isOn = true;
            selectedCharacter = null;
            previousSelected = null;
        }
    }

    public void Cancel()
    {
        ClearValues();
        gameObject.SetActive(false);
    }

    public void Confirm()
    {
        // TODO: change the character sprite
        ClearValues();
        gameObject.SetActive(false);
    }

    public void Open()
    {
        gameObject.SetActive(true);
    }

    public void SetSelectedCharacter(Toggle btn)
    {
        if(selectedCharacter == btn) return;
        
        if (selectedCharacter != null)
        {
            previousSelected = selectedCharacter;
            previousSelected.interactable = true;
            previousSelected.isOn = true;
            previousSelected.GetComponent<Transform>().GetChild(2).gameObject.SetActive(false);
        }
        selectedCharacter = btn;
        selectedCharacter.GetComponent<Transform>().GetChild(2).gameObject.SetActive(true);
        btn.interactable = false;
    }
}
