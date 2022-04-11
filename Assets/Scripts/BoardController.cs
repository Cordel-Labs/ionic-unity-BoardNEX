using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

public class BoardController : MonoBehaviour
{
    [SerializeField] private Tilemap board;
    [SerializeField] private TileBase[] scTiles, pathTiles;
    private Vector3Int pos, prevSet, cTile = new Vector3Int(100, 100, 0);
    private Vector3 mousePos;
    private TileBase cTileObj;
    private int st = 0;
    private bool firstTile = true;

    void Start(){
        // StartCoroutine("GenerateBoard");
    }

    void Update(){
        mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        pos = board.WorldToCell(mousePos) + new Vector3Int(0, 0, 10);
        if(pos != cTile){
            board.SetEditorPreviewTile(cTile, null);
            if((cTileObj = board.GetTile(pos)) && st == 0 && (firstTile || cTileObj.name == "pathClear")){
                board.SetEditorPreviewTile(pos, pathTiles[st]);
            }
            else if(cTileObj && cTileObj.name == "path0"){
                board.SetEditorPreviewTile(pos, pathTiles[st]);
            }
            cTile = pos;
            // board.RemoveTileFlags(pos + new Vector3Int(0, 0, 10), TileFlags.LockColor);
            // board.SetColor(pos + new Vector3Int(0, 0, 10), new Color(255, 0, 0));
        }
        if(Input.GetMouseButtonDown(0) && board.HasEditorPreviewTile(pos)){
            board.SetTile(pos, pathTiles[st]);
            LockTiles(pos);
        }
    }


    private void LockTiles(Vector3Int center, int state = 8){
        if(!firstTile && state == 8){
            LockTiles(prevSet, 7);
        }
        for(int i = 0; i < 6; i++){
            Vector3 rot = Quaternion.Euler(0, 0, 60 * i) * new Vector3(0, .5f, 0);
            var target = board.WorldToCell(board.CellToLocal(center) + rot);
            TileBase targetTile = board.GetTile(target);
            if(targetTile && targetTile.name != "pathBlock" && targetTile.name != "path0"){
                board.SetTile(target, pathTiles[state]);
            }
        }
        prevSet = center;
        firstTile = false;
    }

    // Change the selected Tile to add
    public void ChangeSelection(int ind) => st = ind;

    public void GenerateScenario() => StartCoroutine("GenerateBoard");

    public IEnumerator GenerateBoard(){
        yield return new WaitForSeconds(.3f);
        int xMod = 4, yMod = 3, y, j, count;
        for(int i = 0; i < 10; i++){
            xMod -= (i % 2);
            yMod += 1 - (i % 2);
            j = 1 - (i % 2);
            y = xMod - yMod;
            count = 0;
            for(int x = xMod; x >= (xMod - 5 + (i % 2)); x--){
                for(; j < 2; j++){
                    if(++count > 10)
                        break;
                    var nextTile = board.GetTile(new Vector3Int(x, y, 0));
                    if(nextTile && nextTile.name != "path0"){
                        yield return new WaitForSeconds(.005f);
                        board.SetTile(new Vector3Int(x, y, 0), scTiles[Random.Range(2, scTiles.Length-1)]);
                    }
                    y++;
                }
                j = 0;
            }
        }
    }
}
