import Codes from "/Codes.js";

// windows
const displayWindow = document.getElementById("displayWindow");
displayWindow.addEventListener('mouseup', (event)=> getMouseUp(event));
const interactionWindow = document.getElementById("interactionWindow");
const codesWindow = document.getElementById("codesWindow");
const currentReference = document.getElementById("currentReferenceWindow");
const referenceDisplayWindow = document.getElementById("referenceWindow");
const currentSelectedReferenceEle  = document.getElementById("currentSelectedReferenceDisplay");
currentSelectedReferenceEle.innerHTML ="No Reference Selected"
const codeList = document.getElementById("codeList");
const codeSearchWindow = document.getElementById("codeSearchWindow");
const refDisplayWindow = document.getElementById("referencesDisplayWindow");


// buttons

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

const deleteCodeBtn = document.createElement("button");
deleteCodeBtn.id ="deleteCurrentCode";
deleteCodeBtn.innerHTML = "❌";
deleteCodeBtn.className = "delButton";
deleteCodeBtn.addEventListener("click", deleteCurrentCode);

//inputs
const codeSearchEle = document.getElementById("codeSearchInputReferences");
codeSearchEle.addEventListener("change",displayReferences);
const descSearchEle = document.getElementById("descSearchInputReferences");
descSearchEle.addEventListener("change",displayReferences);
const codeCodeSearchInput = document.getElementById("codecodeSearchInput");
codeCodeSearchInput.addEventListener("change",displayCodes);
const codeDescSearchInput = document.getElementById("codeDescSearchInput");
codeDescSearchInput.addEventListener("change",displayCodes);


// Data-Structure
const markedText ={
    anchorOffset: -1,
    focusOffset: -1,
    text: "",
    fileName: ""
};

const currentCode = {
    codeValue: "",
    codeDesc: ""
}
const reference = {
    codeValue: "",
    markedText: ""
}

var fullData = {
    references: [],
    codes: []
}
const currentSelectedRef = {
    codeValue: "",
    markedText: ""
};
const opendFile ={
    fileName:"",
    text: ""
}

const displayWindows = {
    codeDisWin: true,
    refDisWin: true
}


//Initialisation startup
Start();

// setting up open close windows buttons
const toggleCodesWindowBtn = document.createElement("button");
toggleCodesWindowBtn.onclick=toggleCodesWindow;
toggleCodesWindowBtn.innerHTML = "🔼";
document.getElementById("codesWindow").append(toggleCodesWindowBtn);

const toggleRefWindowBtn = document.createElement("button");
toggleRefWindowBtn.onclick=toggleRefWindow;
toggleRefWindowBtn.innerHTML = "🔼";
document.getElementById("referencesContainer").append(toggleRefWindowBtn);

function Start(){
    displayCodes();
    displayReferences();
}

function toggleCodesWindow(){
    displayWindows.codeDisWin = !displayWindows.codeDisWin;
    //console.log(displayWindows.codeDisWin);
    if (displayWindows.codeDisWin) {
        codeSearchWindow.style="display:block";
        toggleCodesWindowBtn.innerHTML = "🔼";
    } else {
        codeSearchWindow.style="display:none";
        toggleCodesWindowBtn.innerHTML = "🔽";
    }   
}
function toggleRefWindow(){
    displayWindows.refDisWin = !displayWindows.refDisWin;
    console.log(displayWindows.refDisWin);
    if (displayWindows.refDisWin) {
        refDisplayWindow.style="display:block";
        toggleRefWindowBtn.innerHTML = "🔼";
    } else {
        refDisplayWindow.style="display:none";
        toggleRefWindowBtn.innerHTML = "🔽";
    }   
}



function displayCurrentCode(){
    const currentCodeDisplay = document.getElementById("currentCodeDisplay");
    currentCode.codeValue == "" ? 
            currentCodeDisplay.innerHTML = `No current code Selected` 
            : currentCodeDisplay.innerHTML = `Current Code :${currentCode.codeValue} Description : ${currentCode.codeDesc}` ;
    if (currentCodeDisplay.innerHTML != `No current code Selected`) currentCodeDisplay.appendChild(deleteCodeBtn);
        
}

function updateCurrentCode(x){
    currentCode.codeValue = fullData.codes[x].codeValue;        //update the current selected code from the codelist on click
    currentCode.codeDesc = fullData.codes[x].codeDesc;          //update the current selected code from the codelist on click
    displayCurrentCode();
}


function displayCodes(){
    displayCurrentCode();
    codeList.innerHTML= "";
    for (let x in fullData.codes) {
        if (fullData.codes[x].codeValue.toUpperCase().includes(codeCodeSearchInput.value.toUpperCase()) && fullData.codes[x].codeDesc.toUpperCase().includes(codeDescSearchInput.value.toUpperCase())) {
            const newLi = document.createElement("li");
            newLi.innerHTML = `${fullData.codes[x].codeValue}  : ${fullData.codes[x].codeDesc} `;
            newLi.addEventListener("click", () => updateCurrentCode(x));
            codeList.appendChild(newLi);
        }
    }
    
}  
function deleteCurrentCode(){
    let indexToSplice = -1;
    let codeInUse = false;
    for (let i in fullData.references){
        //console.log(currentCode.codeValue + " : " + fullData.references[i].codeValue);
        if(currentCode.codeValue == fullData.references[i].codeValue) codeInUse = true;
    }
    if (codeInUse){
        alert("Code in Use Cannot be deleted");
    } else {
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
        if (!codeFound && !descFound) {
            fullData.codes.push(newCode);
            currentCode.codeValue = newCode.codeValue;
            currentCode.codeDesc =  newCode.codeDesc;
            displayCurrentCode();
        }
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
            fileName: opendFile.fileName
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
function SetSelectedReference(index){
    currentSelectedReferenceEle.innerHTML = "";
    let text = "";
    currentSelectedRef.codeValue = fullData.references[index].codeValue;
    const currentmarkedText = {
        anchorOffset : fullData.references[index].markedText.anchorOffset,
        focusOffset : fullData.references[index].markedText.focusOffset,
        text : fullData.references[index].markedText.text,
        fileName : fullData.references[index].markedText.fileName
    };
    currentSelectedRef.markedText = currentmarkedText;
    //console.log(fullData.references[index].codeValue,fullData.references[index].markedText.fileName);
    
    const delBtn = document.createElement("button");
    delBtn.innerHTML = "❌";
    delBtn.className = "delButton";
    delBtn.onclick=(()=>removeReference(index));
    
    text += currentSelectedRef.codeValue  + " : ";
    text += currentSelectedRef.markedText.text +" : " ;
    text +=  currentSelectedRef.markedText.fileName + "  " ;
    currentSelectedReferenceEle.innerHTML = text ;
    currentSelectedReferenceEle.appendChild(delBtn);
    highlight(index);

    
}

function removeReference(index){
    //console.log("Entered Remove Reference");
    fullData.references.splice(index,1);
    displayReferences();
    currentSelectedReferenceEle.innerHTML = "Reference removed.";
    displayWindow.innerHTML = "";
    //console.log("Finished Remove Reference");
}

function displayReferences(){
    referenceDisplayWindow.innerHTML = "";
    
        for (let x in fullData.references) {
            //console.log(markedText.fileName)
            if (fullData.references[x].codeValue.toUpperCase().includes(codeSearchEle.value.toUpperCase()) 
            && fullData.references[x].markedText.text.toUpperCase().includes(descSearchEle.value.toUpperCase())){
                const newLi = document.createElement("li");
                newLi.innerHTML = 
                `${fullData.references[x].codeValue}  : ${fullData.references[x].markedText.text} : ${fullData.references[x].markedText.fileName} <br>`;
                newLi.addEventListener("click", () => SetSelectedReference(x));
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
        //console.log(file);
        fetch(`${file.name}`)
            .then(response => response.text())
            .then(text => fullData = JSON.parse(text))
            .then(() => {Start();
                interactionWindow.innerHTML ="";    
            });     
    }  
    interactionWindow.innerHTML ="Choose a Save file (saveData.json)";
    interactionWindow.appendChild(fileChooser);   
}

function readAFile(){
    //let file = "";
    interactionWindow.innerHTML = "Choose a Text file (.txt)";
    const fileChooser = document.createElement("input");
        fileChooser.type="file" 
        fileChooser.id="files" 
        fileChooser.name="files[]"
        fileChooser.onchange = function(){
            let file = this.files[0];
            markedText.fileName = file.name;   // set markedText filename
            opendFile.fileName = file.name;                   
            fetch(`./data/${file.name}`)
                .then (response => response.text())
                .then(text=> {displayWindow.innerHTML=text;
                                opendFile.text = text;
                                interactionWindow.innerHTML ="";    
                                });     
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
    markedText.fileName = opendFile.fileName;
    //console.log(markedText);
    displayCurrentReference();
}

function highlight(index){
    //console.log(fullData.references[index].markedText.fileName +" : " + opendFile.fileName);
    if (fullData.references[index].markedText.fileName == opendFile.fileName){
        //console.log("Changing hightlight text");
        //console.log(currentSelectedRef.markedText.text);
        const newText = opendFile.text.replace(currentSelectedRef.markedText.text,` <span class="highlight">${currentSelectedRef.markedText.text}</span>`);
        //console.log(newText);
        displayWindow.innerHTML = newText;
    } else {
        //console.log("different textfile opened");
        openReferenceFile(fullData.references[index].markedText.fileName, index);
    }

    function openReferenceFile(file, index){
        fetch(`./data/${file}`)
        .then (response => response.text())
        .then(text=> {displayWindow.innerHTML=text;
                        opendFile.text = text;
                        opendFile.fileName = file;
                        })
        .then(() => highlight(index));   
    }

 
}


