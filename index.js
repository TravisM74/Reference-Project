import Codes from "/Codes.js";

// windows
const displayWindow = document.getElementById("displayWindow");
displayWindow.addEventListener('mouseup', (event)=> getMouseUp(event));
const interactionWindow = document.getElementById("interactionWindow");
const codesWindow = document.getElementById("codesWindow");
const currentReference = document.getElementById("currentReferenceWindow");
const referenceDisplayWindow = document.getElementById("referenceWindow");

const codeList = document.getElementById("codeList");
// buttons
const displayCodesBtn = document.getElementById("displayCodesBtn");
displayCodesBtn.addEventListener("click", displayCodes);
const displayReferencesBtn = document.getElementById("displayReferencesBtn");
displayReferencesBtn.addEventListener("click", displayReferences);
const readFileBtn = document.getElementById("readFileBtn").onclick = readAFile;

const loadFileBtn = document.getElementById("loadFileBtn").onclick = loadData;


const saveRefBtn = document.createElement("button");
saveRefBtn.innerHTML = "Save Data";
saveRefBtn.addEventListener('click', saveData);
document.getElementById("navBar").appendChild(saveRefBtn);

const newRefBtn = document.createElement("button");
newRefBtn.innerHTML = "add new Reference";
newRefBtn.addEventListener('click', saveReference);
const newCodeBtn = document.getElementById("codeSubmitBtn");
newCodeBtn.addEventListener("click", addNewCode);
const deleteCodeBtn = document.getElementById("deleteCurrentCode");
deleteCodeBtn.addEventListener("click", deleteCurrentCode);

//inputs
const codeSearchEle = document.getElementById("codeSearchInputReferences");
codeSearchEle.addEventListener("change",displayReferences);
const descSearchEle = document.getElementById("descSearchInputReferences");
descSearchEle.addEventListener("change",displayReferences);
// testData
const markedText ={
    anchorOffset: -1,
    focusOffset: -1,
    text: "",
    fileName: ""
};
const markedText2 ={
    anchorOffset: -1,
    focusOffset: -1,
    text: "this is where the test dummy can be found .",
    fileName: "document.txt"
};
const code = {
    codeValue: "code1",
    codeDesc: "a tests code"
}
const code2 ={
    codeValue: "code2",
    codeDesc: "another tests code"
}
const currentCode = {
    codeValue: "",
    codeDesc: ""
}
const reference = {
    codeValue: code.codeValue,
    markedText: markedText2
}

var fullData = {
    references: [reference],
    codes: [code]
}
///fullData.codes.push(code);
fullData.codes.push(code2);

//startup
Start();

function Start(){
    displayCodes();
    displayReferences();
}


function displayCurrentCode(){
    const currentCodeDisplay = document.getElementById("currentCodeDisplay");
    currentCode.codeValue == "" ? 
            currentCodeDisplay.innerHTML = `No current code Selected` 
            : currentCodeDisplay.innerHTML = `Current Code :${currentCode.codeValue} Description : ${currentCode.codeDesc}` ;
        
}

function updateCurrentCode(x){
    currentCode.codeValue = fullData.codes[x].codeValue;        //update the current selected code from the codelist on click
    currentCode.codeDesc = fullData.codes[x].codeDesc;          //update the current selected code from the codelist on click
    displayCurrentCode();
}


function displayCodes(){
    displayCurrentCode();
    let list = ""
    codeList.innerHTML= list;
    for (let x in fullData.codes) {
        const newLi = document.createElement("li");
        newLi.innerHTML = `${fullData.codes[x].codeValue}  : ${fullData.codes[x].codeDesc} `;
        newLi.addEventListener("click", () => updateCurrentCode(x));
        codeList.appendChild(newLi);
    }
    //document.getElementById("codeInputDisplay").style="display:block;";
    //console.log("display codes complete");
}  
function deleteCurrentCode(){
    let indexToSplice = -1;
    for (let x in fullData.codes) {
        if (currentCode.codeValue == fullData.codes[x].codeValue &&
            currentCode.codeDesc == fullData.codes[x].codeDesc){
                indexToSplice = x;
            }
    }
    if (indexToSplice >= 0) {
        fullData.codes.splice(indexToSplice,1);
        currentCode.codeValue = "";
        currentCode.codeDesc = "";
        displayCodes();
    } else {
        alert("No Code Currently selected.");
    }
}
function addNewCode(){
    const codeInput = document.getElementById("codeInput").value;
    const codeDesc = document.getElementById("codeDescInput").value;
    if (codeInput.length >1 && codeDesc.length >1) {
        const newCode = {
            codeValue: codeInput,
            codeDesc: codeDesc
        }
        let codeFound = false;
        let descFound = false;
        for (let x in fullData.codes){
            if (fullData.codes[x].codeValue == newCode.codeValue) {
                codeFound = true;
            }
            if (fullData.codes[x].codeDesc == newCode.codeDesc) {
                descFound = true;
            }
        } 
        if (codeFound) alert("Code Exists already");
        if (descFound) alert("Description Exists already");
        if (!codeFound && !descFound) fullData.codes.push(newCode);
  
    } else {
        alert("No code information entered \n\nFill in Code Id and Code Description");
    }
    displayCodes();

}

function saveReference(){
    // console.log("Currently not validated!!!");
    if (currentCode.codeValue !== "" && markedText.text !== ""){
        const newMarkedText = { 
            anchorOffset: markedText.anchorOffset,
            focusOffset: markedText.focusOffset,
            text: markedText.text,
            fileName: markedText.fileName
        }
        const newRef = {    codeValue: currentCode.codeValue,
                            markedText: newMarkedText 
                        }
        fullData.references.push(newRef);
    } else {
        alert("no selected Code or Text selection missing !!");
    }
    displayReferences();
}

function saveData(){
    console.log('save started');
    const data = JSON.stringify(fullData);
    var file = new Blob([data],{type : "text"});
    var anc = document.createElement("a");
    anc.href = URL.createObjectURL(file);
    anc.download = "saveData.json";
    anc.click();
    console.log ("pretend saves look into hosts");
} 


function displayReferences(){
    referenceDisplayWindow.innerHTML = "";

    for (let x in fullData.references) {
        //console.log(markedText.fileName)
        if (fullData.references[x].codeValue.includes(codeSearchEle.value) 
            && fullData.references[x].markedText.text.includes(descSearchEle.value)){
            const newLi = document.createElement("li");
            newLi.innerHTML = 
            `${fullData.references[x].codeValue}  : ${fullData.references[x].markedText.text} : ${fullData.references[x].markedText.fileName}<br>`;
            //newLi.addEventListener("click", () => deleteReference(x));
            referenceDisplayWindow.appendChild(newLi);  
        }

    }
    //console.log(fullData.references);
}
function displayCurrentReference(){
    currentReference.innerHTML =    `<p>File: ${markedText.fileName} </p>
                                    <p>Text: ${markedText.text} </p>
                                    `
    //currentReference.appendChild(saveRefBtn);
    currentReference.appendChild(newRefBtn);
}
function loadData(){
    
    const fileChooser = document.createElement("input");
    fileChooser.type="file" ;
    fileChooser.id="input";

    fileChooser.onchange = function(){
        let file = this.files[0];
        console.log(file);
        fetch(`${file.name}`)
            .then(response => response.text())
            .then(text => fullData = JSON.parse(text))
            .then(() => Start());     
    }  

    interactionWindow.innerHTML ="";
    interactionWindow.appendChild(fileChooser);
    
}
function readAFile(){
    //let file = "";
    interactionWindow.innerHTML = "";
    const fileChooser = document.createElement("input");
        fileChooser.type="file" 
        fileChooser.id="files" 
        fileChooser.name="files[]"
        fileChooser.onchange = function(){
            let file = this.files[0];
            markedText.fileName = file.name                      // set markedText filename
            fetch(`./data/${file.name}`)
                .then (response => response.text())
                .then(text=> displayWindow.innerHTML=text);     
        }
        interactionWindow.appendChild(fileChooser);
        displayReferences();
    //console.log('filename :'+file.name);
}

function getMouseUp(e){
    //console.log(e);
    //console.log(window.getSelection());
    markedText.anchorOffset = window.getSelection().anchorOffset;
    markedText.focusOffset = window.getSelection().focusOffset;
    markedText.text = window.getSelection().toString(); 
    //console.log(markedText);
    displayCurrentReference();
}


