import {URLcheck} from '/url-print-check.js'
let links = [""]
let textArea = document.getElementById("textArea")
const saveURLBtn = document.getElementById("saveURL")
const resetBtn = document.getElementById("reset")
const ul = document.getElementById("ul-el")
const deleteBtns = document.getElementsByClassName("dltBtn")
const copyBtns = document.getElementsByClassName("copyBtns")
let undo = [""]

if (JSON.parse(localStorage.getItem("links"))){
    links = JSON.parse(localStorage.getItem("links"))
    render(links)
}

//For every URL saved, two indexes are used in the 'links' array.
//Firstly, one index is used for saving the link.
//Then, second index is used for title.

saveURLBtn.addEventListener("click", function(){
    if ( textArea.value && textArea.value.indexOf(" ") !=0 ){
        URLcheck(links)
        render(links)
        localStorage.setItem("links", JSON.stringify(links))
        textArea.value = ""
        window.location.reload();
    } else {
        document.getElementById("note").style.display = "block"
        document.getElementById("note").innerText = "Invalid URL"
        setTimeout(() => {
            document.getElementById("note").style.display = "none"
        }, 2000);
    }
})

textArea.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveURLBtn.click();
    }
});

document.getElementById("saveTab").addEventListener("click", function(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        links.unshift(`${tabs[0].title}`);
        links.unshift(`${tabs[0].url}`);
        render(links)
        localStorage.setItem("links", JSON.stringify(links))
        window.location.reload();
    })
})

function render(list){
    let listItem = ""
    let url = ""
    for (let j=0; j<list.length; j++){
        if (j % 2 == 0){
            url = `${list[j]}`
        } else {
            if (list[j] == url){
                if (list[j].includes(" ") || (list[j].includes(".") == false)){
                    listItem += `
                    <li id="list-item-${j}">
                        <a style="cursor: auto;"><span class= "tabTitle">${url}</span></a>
                        <div class = "listBtnContainer">
                            <button id="${j}" type="button" class="listButtons copyBtns">Copy</button>
                            <button id="${j}" type="button" class="listButtons dltBtn">Delete</button>
                        </div>
                    </li>`
                } else {
                    listItem += `
                    <li id="list-item-${j}">
                    <a href="${url}" target="_blank"><span class= "tabTitle">${url}</span></a>
                    <div class = "listBtnContainer">
                    <button id="${j}" type="button" class="listButtons copyBtns">Copy</button>
                    <button id="${j}" type="button" class="listButtons dltBtn">Delete</button>
                    </div>
                    </li>`
                }
            } else {
                listItem += `
                <li id="list-item-${j}">
                    <a href="${url}" target="_blank"><span class= "tabTitle">${list[j]}</span> (<span class="tabUrl">${url}</span>)</a>
                    <div class = "listBtnContainer">
                        <button id="${j}" type="button" class="listButtons copyBtns">Copy</button>
                        <button id="${j}" type="button" class="listButtons dltBtn">Delete</button>
                    </div>
                </li>`
            }
            // URLprint(list, j, url, listItem)
        }
        ul.innerHTML = listItem
    }
}

for (let copyBtn of copyBtns){
    copyBtn.addEventListener("click", function(){
        const body = document.querySelector('body');
        const area = document.createElement('textarea');
        body.appendChild(area);

        area.value = links[this.id - 1];
        navigator.clipboard.writeText(area.value)
        this.innerText = "Copied!"

        body.removeChild(area);
        setTimeout(function(){
            copyBtn.innerText = "Copy"
        }, 2000)
    })
}

for (let deleteBtn of deleteBtns){
    deleteBtn.addEventListener("click", function(){
        let index = this.id

        //For adding undo function
        // 1. Store every undo in a array with index position equal to the delete button id
        // 2. Change list item id to deleted and give it delete button id
        // 3. If undo button is clicked, change ul html to undo array element with index equal to undo button clicked
        // 4. Set timeout function 3 seconds for every list item after which if list item id is equal to deleted then delete the list and clear from local storage

        undo[index] = document.getElementById(`list-item-${index}`).innerHTML
        let height = document.getElementById(`list-item-${index}`).clientHeight
        document.getElementById(`list-item-${index}`).innerHTML = `
            <span class="text-deleted">Deleted</span>
            <button class="undo" id="undo-${index}">Undo</button>`
        document.getElementById(`list-item-${index}`).style.height = `${height-10}px`
        document.getElementById(`list-item-${index}`).id = `deleted-${index}`

        document.getElementById(`undo-${index}`).addEventListener("click", ()=>{
            document.getElementById(`deleted-${index}`).innerHTML = undo[index]
            document.getElementById(`deleted-${index}`).id = `list-item-${index}`
            window.location.reload();
        })

        setTimeout(()=>{
            if (document.getElementById(`undo-${index}`).parentElement.id == `deleted-${index}`){
                links.splice(index - 1, 2)
                render(links)
                localStorage.setItem("links", JSON.stringify(links))
                window.location.reload();
            }
        }, 2500)
    });
}

resetBtn.addEventListener("dblclick", function(){
    localStorage.clear()
    links = []
    textArea.value = ""
    ul.innerHTML = ""
    render(links)
})

