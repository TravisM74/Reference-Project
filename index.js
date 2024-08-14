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
    codes: [],
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




//Initialisation startup / refresh everything
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

// refreshes all window elements
function Start(){
    displayCodes();
    displayReferences();
    
}

// close/open the Codes window
function toggleCodesWindow(){
    displayWindows.codeDisWin = !displayWindows.codeDisWin;
    //console.log(displayWindows.codeDisWin);
    setCodWindow();
}

function setCodWindow(){
    if (displayWindows.codeDisWin) {
        codeSearchWindow.style="display:block";
        toggleCodesWindowBtn.innerHTML = "🔼";
    } else {
        codeSearchWindow.style="display:none";
        toggleCodesWindowBtn.innerHTML = "🔽";
    }   
}

// close/open the references window
function toggleRefWindow(){
    displayWindows.refDisWin = !displayWindows.refDisWin;
    // console.log(displayWindows.refDisWin);
    setRefWindow()
}
function setRefWindow(){
    if (displayWindows.refDisWin) {
        refDisplayWindow.style="display:block";
        toggleRefWindowBtn.innerHTML = "🔼";
    } else {
        refDisplayWindow.style="display:none";
        toggleRefWindowBtn.innerHTML = "🔽";
    }   
}
 function setWindows(){
    setRefWindow();
    setCodWindow();
 }

// displays the currently selected code in the selected code window
function displayCurrentCode(){
    const currentCodeDisplay = document.getElementById("currentCodeDisplay");
    currentCode.codeValue == "" ? 
            currentCodeDisplay.innerHTML = `No current code Selected` 
            : currentCodeDisplay.innerHTML = `Current Code :${currentCode.codeValue} Description : ${currentCode.codeDesc}` ;
    if (currentCodeDisplay.innerHTML != `No current code Selected`) currentCodeDisplay.appendChild(deleteCodeBtn);
        
}
// set the current code variable to the freshly selected code
function updateCurrentCode(x){
    currentCode.codeValue = fullData.codes[x].codeValue;        //update the current selected code from the codelist on click
    currentCode.codeDesc = fullData.codes[x].codeDesc;          //update the current selected code from the codelist on click
    displayCurrentCode();
}

/* 
    list the codes in the code window filtered by the code and desc input fields for searching
        searching case comparrison to both uppercase
        Eventlistener added to function updateCurrent code
        valid codes appended as li to the ul codeDisplay window
*/
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

/*
    fullData.references is searched through to see if code is in use in any references
    Error reported if in use

    codes array in the fullData object searched then throught for matching code, code is then removed
    removed via splice method
*/
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

/*
    new code data taken from inputs
        tested to make sure both fields are not blank
        fullData.codes is then searched to see if any data matches other codes
        alerts to error if code exists otherwise creates code
    new code set to current code.
*/
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

/*
    current code and marked code tested if empty
    values set for new marked text from marked text
    new reference created with code and newmarked Text
    new reference added to fullData.
*/
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

/*
    a text blob is created from fullData
    a link is created for the textblob
    link is then selfclicked to produce a downloadfile.
*/
function saveData(){
    /*
    console.log('save started');
    const data = JSON.stringify(fullData);
    var file = new Blob([data],{type : "text"});
    var anc = document.createElement("a");
    anc.href = URL.createObjectURL(file);
    anc.download = "saveData.json";
    anc.click();
    console.log ("pretend saves look into hosts");
    */
    localStorage.setItem("fullData", JSON.stringify(fullData));
    localStorage.setItem("displayWindows", JSON.stringify(displayWindows));
} 

/*
    creating the currently selected Reference display
    the index i used to select reference the relevant recorde
    currrentmarkedText object loaded with data from fullData.references
    delete button created to to function removeReference passing index
    text string made from currentmarkedText data and set to currentSelectedReferenceEle element
    delete button appeneded 

*/
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

/*
    removeReverence recieves an index from a listed reference
    splices Reference from fullData.references
*/
function removeReference(index){
    //console.log("Entered Remove Reference");
    fullData.references.splice(index,1);
    displayReferences();
    currentSelectedReferenceEle.innerHTML = "Reference removed.";
    displayWindow.innerHTML = "";
    //console.log("Finished Remove Reference");
}

/*
    Displays a list of references from fullData.references
    Filters references from inputs compaired to uppercase from fullData.references
    adds an on click event to set SelectedReference
    adds the valid referenced as li to the References display window of ul
*/
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

/*
    the current reference is the selected text
    set the element currentReference to the MarkedTest variables
    adds a button to add the completed reference.
*/
function displayCurrentReference(){
    currentReference.innerHTML =    `<p>File: ${markedText.fileName} </p>
                                    <p>Text: ${markedText.text} </p>
                                    `
    //currentReference.appendChild(saveRefBtn);
    currentReference.appendChild(newRefBtn);
}

/*
    creates a fileselector to select the saveData.json file
    file needs to be located in the working directory
    parses the data from the file into the fullData object
*/
function loadData(){
    /*
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
    */
   
    const fullDataObject = localStorage.getItem("fullData");
    if (!fullDataObject) {
        console.log("Error no data previously saved.");
        
    } else {
       fullData = JSON.parse(fullDataObject);
    }
    const winStr = localStorage.getItem("displayWindows");
    if (!winStr) {
        displayWindows.codeDisWin = true;
        displayWindows.refDisWin = true;
    } else {
        const displayObj = JSON.parse(winStr);
        displayWindows.codeDisWin = displayObj.codeDisWin;
        displayWindows.refDisWin = displayObj.refDisWin;
    }
    Start();
    setWindows();
}

/*
    creates a file selector to select a text file 
    must be from the Data folder and .txt
    set the name and data of object opendFile.fileName and .text
    then refreshes the references displayed
*/
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

/*
    getmouseup called when the mouse button is released in the document window
    set the relevant data points of the event to the markedText object
    refreshes the displayCurrentReference 
*/
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

/*
    check to see if the current opend file is the same as the referencefile using the referance index
    opens the correct file if not using openReferanceFile passing the name and the index of the reference.
    replaces the matching text in the file to include a <span> with a highlicgh css class
*/
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

    /*
        takes a file name and reference index
        opens a file in the datafolder witht he passed name
        sets the opendFile object to the new data
        calls the highlight function and passes it the index of the reference
    */
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


