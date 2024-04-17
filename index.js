import Codes from "/Codes.js";


const displayWindow = document.getElementById("displayWindow");
displayWindow.addEventListener('mouseup', (event)=> getMouseUp(event));
const interactionWindow = document.getElementById("interactionWindow");
const codesWindow = document.getElementById("codesWindow");
const currentReference = document.getElementById("referenceWindow");
const codeList = document.getElementById("codeList");
const displayCodesBtn = document.getElementById("displayCodesBtn");
displayCodesBtn.addEventListener("click", displayCodes);


const markedText ={
    anchorOffset: -1,
    focusOffset: -1,
    text: "test dummy",
    fileName: "document.txt"
};
const code = {
    codeValue: "test1",
    codeDesc: "a tests code"
}
const code2 ={
    codeValue: "test2",
    codeDesc: "another tests code"
}
const currentCode = {
    codeValue: "",
    codeDesc: ""
}
const reference = {
    codeValue: code.codeValue,
    markedText: markedText
}

const fullData = {
    references: [reference],
    codes: [code]
}
///fullData.codes.push(code);
fullData.codes.push(code2);



const readFileBtn = document.getElementById("readFileBtn").onclick = readAFile;

const saveRefBtn = document.createElement("button");
saveRefBtn.innerHTML = "Save Data";
saveRefBtn.addEventListener('click', saveData);
const newRefBtn = document.createElement("button");
newRefBtn.innerHTML = " add new Reference";
newRefBtn.addEventListener('click', saveReference);

function displayCodes(){
    console.log(fullData.codes.length);
    let list = ""
    codeList.innerHTML= list;
    for (let x in fullData.codes) {
        const newLi = document.createElement("li");
        newLi.innerHTML = `${fullData.codes[x].codeValue}  : ${fullData.codes[x].codeDesc} <br>`;
        codeList.appendChild(newLi);
    }
    //document.getElementById("codeInputDisplay").style="display:block;";
    console.log("display codes complete");

}  

function saveReference(){
    if (currentCode.codeValue !== null && markedText.text !== null){

    }
}

function saveData(){
    console.log('save started');
    const data = JSON.stringify(fullData);
    var file = new Blob([data],{type : "text"});
    var anc = document.createElement("a");
    anc.href = URL.createObjectURL(file);
    anc.download = "saveData.txt";
    //anc.click();
    console.log ("pretend saves look into hosts");
}    

function displayCurrentReference(){
    currentReference.innerHTML =    `<p>File: ${markedText.fileName} </p>
                                    <p>Text: ${markedText.text} </p>
                                    `
    currentReference.appendChild(saveRefBtn);
    currentReference.appendChild(newRefBtn);
}

function readAFile(){
    //let file = "";
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
    //console.log('filename :'+file.name);
}

function getMouseUp(e){
    console.log(e);
    console.log(window.getSelection());
    markedText.anchorOffset = window.getSelection().anchorOffset;
    markedText.focusOffset = window.getSelection().focusOffset;
    markedText.text = window.getSelection().toString(); 
    console.log(markedText);
    displayCurrentReference();
}


