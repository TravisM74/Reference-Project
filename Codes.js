import Code from "/Code.js";

export default class Codes {
    constructor(){
        let codeList = [] ;
        this.loadCodes();
    }

    addCode(codeId, codeDesc){
        codeList.push(new Code(codeId, codeDesc));
    }
    loadCodes(){
        fetch(`/config/codes.json`)
                .then (response => {console.log(response)
                    response.text()                   
                })
                .then(data => console.log("codes :" +data)
                            );
    }

}