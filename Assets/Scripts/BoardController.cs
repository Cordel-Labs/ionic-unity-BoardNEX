using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Tilemaps;
using UnityEngine.EventSystems;

public class BoardController : MonoBehaviour
{
    [SerializeField] private Tilemap board;
    [SerializeField] private TileBase[] scTiles, pathTiles;
    [SerializeField] private Text errorText;
    private List<Vector3Int> tilePath = new List<Vector3Int>();
    private Vector3Int pos, prevSet, currentTile = new Vector3Int(100, 100, 0);
    private Vector3 mousePos;
    private TileBase cTileObj, preview, st;
    private List<Change> changes = new List<Change>();
    private int cInd = 0;
    // private int st = 0;
    private bool firstTile = true;

    [SerializeField] private GraphicRaycaster m_Raycaster;
    [SerializeField] private EventSystem m_EventSystem;
    [SerializeField] private RectTransform canvasRect;
    private PointerEventData m_PointerEventData;
    private List<RaycastResult> results;
    
    private readonly Dictionary<string, TileBase> tilesTypes = new Dictionary<string, TileBase>();

    void Start(){
        st = pathTiles[0];

        foreach (var pathTile in pathTiles){
            tilesTypes.Add(pathTile.name, pathTile);
        }

        foreach (var tile in scTiles){
            tilesTypes.Add(tile.name, tile);
        }
        
#if !UNITY_EDITOR && UNITY_WEBGL
        WebGLInput.captureAllKeyboardInput = false;
        FirebaseManager.WindowMessage("started");
#endif
    }

    void Update(){
        if (Camera.main != null) mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        pos = board.WorldToCell(mousePos) + new Vector3Int(0, 0, 10);
        
        if(pos != currentTile && st){
            board.SetTile(currentTile, (preview) ? preview : null);
            preview = board.GetTile(pos);
            if((cTileObj = board.GetTile(pos)) && st.name == "path0" && (firstTile || (preview && preview.name == "pclearPath"))){
                // tile de caminho
                board.SetTile(pos, st);
            }
            else if(cTileObj && cTileObj.name == "path0" && st.name != "path0" && !st.name.Contains("cenario")){
                // tiles no caminho
                board.SetTile(pos, st);
            }
            else if(cTileObj && st.name == "cenario0" && cTileObj.name.Contains("path")){
                // eraser
                board.SetTile(pos, st);
            } 
            else if (cTileObj && !st.name.Contains("path") && !cTileObj.name.Contains("path")){
                // tiles de cenario
                board.SetTile(pos, st);
            }
            currentTile = pos;
        }
        
        if(Input.GetMouseButtonDown(0) && board.HasTile(pos) && board.GetTile(pos).name == st.name){
            if(MouseAboveCanva()) return;
            if(st.name == "path0" && tilePath.Contains(pos)) return;
            if(cInd > 0){
                changes.RemoveRange(changes.Count - cInd, cInd);
                cInd = 0;
            }
            changes.Add(new Change(new Vector3Int[1]{pos}, preview.name, st.name));
            if(st.name == "path0"){
                tilePath.Add(pos);
                LockTiles(pos);
            }
            else if(st.name == "cenario0"){
                EraseTile(tilePath.IndexOf(pos));
            }
            preview = st;
        }
    }

    public void UndoAction(){
        // There are actions to Undo
        if(cInd < changes.Count){
            cInd++;
            Change undo = changes[changes.Count - cInd];
            // Itarate array of tiles changed with the action
            for(int i = 0; i < undo.cPos.Length; i++){
                // Add back to the tilePath if it was a path0 tile (undoing Eraser)
                if(undo.prevTile == "path0")
                    tilePath.Add(undo.cPos[i]);
                board.SetTile(undo.cPos[i], tilesTypes[undo.prevTile]);
            }
            if(undo.newTile == "path0"){
                // Remove from the tilePath if it undid a path0 tile
                tilePath.RemoveAt(tilePath.Count - 1);
            }
            if(st.name == "path0"){
                // Update Editor Preview Tiles with the change
                ClearPathPreview();
                firstTile = true;
                if(tilePath.Count > 1){
                    for (int i = 0; i < tilePath.Count - 1; i++){
                        LockTiles(tilePath[i], 7);
                    }
                }
                if(tilePath.Count > 0)
                    LockTiles(tilePath[tilePath.Count - 1]);
            }
        }
    }

    public void RedoAction(){
        // There are actions to Redo
        if(cInd > 0){
            cInd--;
            Change redo = changes[changes.Count - 1 - cInd];
            // Itarate array of tiles changed with the action
            for(int i = 0; i < redo.cPos.Length; i++){
                // Remove from the tilePath if it is a cenario0 tile (redoing Eraser)
                if(redo.newTile == "cenario0")
                    tilePath.Remove(redo.cPos[i]);
                board.SetTile(redo.cPos[i], tilesTypes[redo.newTile]);
            }
            if(redo.newTile == "path0"){
                // Add to the tilePath if it redid a path0 tile
                tilePath.Add(redo.cPos[0]);
            }
            if(st.name == "path0"){
                // Update Editor Preview Tiles with the change
                if(redo.newTile == "cenario0"){
                    // If redoing Eraser
                    ClearPathPreview();
                    firstTile = true;
                    if(tilePath.Count > 1){
                        for (int i = 0; i < tilePath.Count - 1; i++){
                            LockTiles(tilePath[i], 7);
                        }
                    }
                    if(tilePath.Count > 0)
                        LockTiles(tilePath[tilePath.Count - 1]);
                }
                else if(redo.newTile == "path0"){
                    // If redoing a path0 tile
                    // board.SetEditorPreviewTile(redo.cPos[0], null);
                    LockTiles(redo.cPos[0]);
                }
            }
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
            preview = board.GetTile(target);
            if(targetTile && targetTile.name != "path0" && !(preview && preview.name == "pblockPath")){
                board.SetTile(target, pathTiles[state]);
            }
        }
        preview = null;
        prevSet = center;
        firstTile = false;
    }

    private void EraseTile(int ind){
        // Array of tiles being erased
        int qnt = tilePath.Count - ind, j = qnt;
        Vector3Int[] posArray = new Vector3Int[qnt];
        for(int i = tilePath.Count - 1; i > ind; i--){
            posArray[--j] = tilePath[i];
            board.SetTile(tilePath[i], st);
            // board.SetEditorPreviewTile(tilePath[i], null);
            tilePath.RemoveAt(i);
        }
        posArray[--j] = tilePath[ind];
        // Save eraser changes to changes array
        changes.Add(new Change(posArray, "path0", "cenario0"));
        tilePath.RemoveAt(ind);
        if(ind == 0){
            // If erasing from the first tile, make sure it has 'firstTile = true' again
            firstTile = true;
        }
    }

    // Change the selected Tile to add
    public void PathSelection(string tileName){
        if (tileName == "path0" && tilePath.Count > 0 && !(st && st.name == "path0"))
        {
            if (tilePath.Count > 1)
            {
                for (int i = 0; i < tilePath.Count - 1; i++)
                {
                    LockTiles(tilePath[i], 7);
                }
            }
            firstTile = true;
            LockTiles(tilePath[tilePath.Count - 1]);
        }

        st = tilesTypes[tileName];
    }

    public void ScenarioSelection(string tileName){
        st = tilesTypes[tileName];
        ClearPathPreview();
    }

    public void ClearPreviewTiles() {
        st = null;
        ClearPathPreview();
    }    

    public void GenerateBoard(string[] brd){
        tilePath = new List<Vector3Int>(new Vector3Int[int.Parse(brd[0])]);
        int z = 1, xMod = 4, yMod = 3, y, j, count;
        for(int i = 0; i < 10; i++){
            xMod -= (i % 2); yMod += 1 - (i % 2);
            j = 1 - (i % 2); y = xMod - yMod; count = 0;
            for(int x = xMod; x >= (xMod - 5 + (i % 2)); x--){
                for(; j < 2; j++){
                    if(++count > 10) break;
                    var nextTile = board.GetTile(new Vector3Int(x, y, 0));
                    if(nextTile) {
                        if(brd[z].Contains("path0")){
                            string[] nameNind = brd[z++].Split('_');
                            tilePath[int.Parse(nameNind[1])] = new Vector3Int(x, y, 0);
                            board.SetTile(new Vector3Int(x, y, 0), tilesTypes[nameNind[0]]);
                        }
                        else board.SetTile(new Vector3Int(x, y, 0), tilesTypes[brd[z++]]);
                    }
                    y++;
                }
                j = 0;
            }
        }
        if (tilePath.Count > 0 && st && st.name == "path0"){
            firstTile = false;
            if (tilePath.Count > 1){
                for (int i = 0; i < tilePath.Count - 1; i++){
                    LockTiles(tilePath[i], 7);
                }
            }
            firstTile = true;
            LockTiles(tilePath[tilePath.Count - 1]);
        }
    }

    public string GetBoardAsList(){
        string[] boardList = new string[101];
        boardList[0] = tilePath.Count.ToString();
        int z = 1, xMod = 4, yMod = 3, y, j, count;;
        for(int i = 0; i < 10; i++){
            xMod -= (i % 2); yMod += 1 - (i % 2);
            j = 1 - (i % 2); y = xMod - yMod; count = 0;
            for(int x = xMod; x >= (xMod - 5 + (i % 2)); x--){
                for(; j < 2; j++){
                    if(++count > 10) break;
                    var nextTile = board.GetTile(new Vector3Int(x, y, 0));
                    if(nextTile){
                        boardList[z++] = (nextTile.name.Contains("Path")) ? "cenario0" : nextTile.name;
                        if(nextTile.name == "path0") boardList[z-1] += "_" + tilePath.IndexOf(new Vector3Int(x, y, 0)).ToString();
                    } 
                    y++;
                }
                j = 0;
            }
        }
        return string.Join(";", boardList);
    }

    public void ClearPathPreview(){
        int xMod = 4, yMod = 3, y, j, count;
        for(int i = 0; i < 10; i++){
            xMod -= (i % 2); yMod += 1 - (i % 2);
            j = 1 - (i % 2); y = xMod - yMod; count = 0;
            for(int x = xMod; x >= (xMod - 5 + (i % 2)); x--){
                for(; j < 2; j++){
                    if(++count > 10) break;
                    var nextTile = board.GetTile(new Vector3Int(x, y, 0));
                    if(nextTile && (nextTile.name == "pblockPath" || nextTile.name == "pclearPath")) board.SetTile(new Vector3Int(x, y, 0), tilesTypes["cenario0"]);
                    y++;
                }
                j = 0;
            }
        }
    }

    public void SaveBoard(){
        // FirebaseManager.Instance.PostData("boardPath", GetBoardAsList(), gameObject.name);
        FirebaseManager.WindowMessage("board" + GetBoardAsList());
    }

    public void GetBoard(){
        FirebaseManager.Instance.GetData("boardPath", gameObject.name);
    }

    public void CallbackFunc(string message){
        if(message == "Success") return;
        else {
            Debug.Log(message);
            GenerateBoard(message.Replace("\"", "").Replace("{", "").Replace("}", "").Split(';'));
        }
    }

    public void FallbackFunc(string err){
        errorText.text = err;
    }

    public void AbortEditing(){
        FirebaseManager.WindowMessage("leaveEditor");
    }
    
    public void OpenPopup(GameObject popup) {
        popup.SetActive(true);
    }
    
    public void ClosePopup(GameObject popup) {
        popup.SetActive(false);
    }

    public bool MouseAboveCanva(){
        m_PointerEventData = new PointerEventData(m_EventSystem);
        m_PointerEventData.position = Input.mousePosition;
        results = new List<RaycastResult>();
        m_Raycaster.Raycast(m_PointerEventData, results);
        if(results.Count > 0) return true;
        else return false;
    }
}

public struct Change
{
    public Vector3Int[] cPos;
    public string prevTile, newTile;

    public Change(Vector3Int[] pos, string pt, string nt)
    {
        cPos = pos;
        prevTile = (pt == "pclearPath") ? "cenario0" : pt;
        newTile = nt;
    }
}