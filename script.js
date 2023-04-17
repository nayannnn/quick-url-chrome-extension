import {URLcheck} from '/url-print-check.js'

let urlListOne = [""]
let urlListTwo = [""]
let tabCache = [""]
let textArea = document.getElementById("textArea")
const saveURLBtn = document.getElementById("saveURLButton")
const resetBtn = document.getElementById("reset")
const ul = document.getElementById("ul-el")
const removeBtns = document.getElementsByClassName("removeBtns")
const copyBtns = document.getElementsByClassName("copyBtns")
const renameBtns = document.getElementsByClassName("renameBtns")
const tabs = document.getElementsByClassName("tab")
// let undo = [""]

document.getElementsByClassName("linkTabs")[0].addEventListener("contextmenu", function(){
    event.preventDefault();
})

setTimeout(() => {
    tabs[0].click()
}, 100)

if (JSON.parse(localStorage.getItem("urlListOne"))){
    urlListOne = JSON.parse(localStorage.getItem("urlListOne"))
    render(urlListOne)
}

for (let tab of tabs){
    tab.addEventListener("click", function(){
        for (let tab of tabs){
            tab.classList.remove("active")
        }
        this.classList.add("active")
        tabCache[0] = this.indexOf()
        console.log(tabCache[0])
        localStorage.setItem("tabCache", JSON.stringify(tabCache))
        document.getElementById("ul-el").style.display = "none"
    })
}

tabs[0].addEventListener("click", function(){
    document.getElementById("ul-el").style.display = "block"
})

//For every URL saved, two indexes are used in the 'urlListOne' array.
//First index is used for saving the link.
//Second index is used for title.

//Save URL from input placeholder
saveURLBtn.addEventListener("click", function(){
    if ( textArea.value && textArea.value.indexOf(" ") !=0 ){
        if (document.getElementsByClassName("tab")[0].classList.contains("active")){
            URLcheck(urlListOne)
            render(urlListOne)
            localStorage.setItem("urlListOne", JSON.stringify(urlListOne))
            textArea.value = ""
            window.location.reload();
        }
    } else {
        document.getElementById("note").style.display = "block"
        document.getElementById("note").innerText = "Invalid URL"
        setTimeout(() => {
            document.getElementById("note").style.display = "none"
        }, 2000);
    }
})

//Save URL from input placeholder by pressing 'Enter'
textArea.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveURLBtn.click();
    }
});

//Save current tab
document.getElementById("saveTab").addEventListener("click", function(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        if (document.getElementsByClassName("tab")[0].classList.contains("active")){
            urlListOne.unshift(`${tabs[0].title}`);
            urlListOne.unshift(`${tabs[0].url}`);
            render(urlListOne)
            localStorage.setItem("urlListOne", JSON.stringify(urlListOne))
            window.location.reload();
        }
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
                    <li class = "list-item" id="list-item-${j}">
                        <a style="cursor: auto;"><span class= "tabTitle">${url}</span></a>
                        <div class = "listBtnBox">
                            <button id="${j}" type="button" class="listButtons copyBtns"><i class="fa-solid fa-copy list-icons icon-copy"></i>Copy</button>
                            <button id="${j}" type="button" class="listButtons removeBtns"><i class="fa-solid fa-trash list-icons icon-remove"></i>Remove</button>
                            <button id="${j}" type="button" class="listButtons renameBtns"><i class="fa-solid fa-pen-to-square list-icons icon-rename"></i>Rename</button>
                        </div>
                    </li>`
                } else {
                    listItem += `
                    <li class = "list-item" id="list-item-${j}">
                        <a href="${url}" target="_blank"><span class= "tabTitle">${url}</span></a>
                        <div class = "listBtnBox">
                            <button id="${j}" type="button" class="listButtons copyBtns"><i class="fa-solid fa-copy list-icons icon-copy"></i>Copy</button>
                            <button id="${j}" type="button" class="listButtons removeBtns"><i class="fa-solid fa-trash list-icons icon-remove"></i>Remove</button>
                            <button id="${j}" type="button" class="listButtons renameBtns"><i class="fa-solid fa-pen-to-square list-icons icon-rename"></i>Rename</button>
                        </div>
                    </li>`
                }
            } else {
                listItem += `
                <li class = "list-item" id="list-item-${j}">
                    <a href="${url}" target="_blank"><span class= "tabTitle">${list[j]}</span> <span class="tabUrl">${url}</span></a>
                    <div class = "listBtnBox">
                        <button id="${j}" type="button" class="listButtons copyBtns"><i class="fa-solid fa-copy list-icons icon-copy"></i>Copy</button>
                        <button id="${j}" type="button" class="listButtons removeBtns"><i class="fa-solid fa-trash list-icons icon-remove"></i>Remove</button>
                        <button id="${j}" type="button" class="listButtons renameBtns"><i class="fa-solid fa-pen-to-square list-icons icon-rename"></i>Rename</button>
                    </div>
                </li>`
            }
        }
        ul.innerHTML = listItem
    }
}

for (let copyBtn of copyBtns){
    copyBtn.addEventListener("click", function(){
        const body = document.querySelector('body');
        const area = document.createElement('textarea');
        body.appendChild(area);

        area.value = urlListOne[this.id - 1];
        navigator.clipboard.writeText(area.value)
        this.innerHTML = `<i class="fa-solid fa-square-check list-icons"></i></i>Copied!`

        body.removeChild(area);
        setTimeout(function(){
            copyBtn.innerHTML = `<i class="fa-solid fa-copy list-icons icon-copy"></i>Copy`
        }, 2000)
    })
}

for (let removeBtn of removeBtns){
    removeBtn.addEventListener("click", function(){
        let index = this.id
        urlListOne.splice(index - 1, 2)
        render(urlListOne)
        localStorage.setItem("urlListOne", JSON.stringify(urlListOne))
        window.location.reload()
    })
}

for (let renameBtn of renameBtns){
    renameBtn.addEventListener("click", function(){
        let index = this.id
        let oldName = urlListOne[index]
        let newName = prompt("Enter the new name")
        if (newName){
            urlListOne[index] = newName
        } else {
            urlListOne[index] = oldName
        }
        render(urlListOne)
        localStorage.setItem("urlListOne", JSON.stringify(urlListOne))
        window.location.reload()
    })
}

// function openCity(evt, cityName) {
//     let tabcontent = document.getElementsByClassName("render");
//     for (let i = 0; i < tabcontent.length; i++) {
//       tabcontent[i].style.display = "none";
//     }
//     let taburlList = document.getElementsByClassName("taburlList");
//     for (i = 0; i < taburlList.length; i++) {
//       taburlList[i].className = taburlList[i].className.replace(" active", "");
//     }
//     document.getElementById(cityName).style.display = "block";
//     evt.currentTarget.className += " active";
// }




















// resetBtn.addEventListener("dblclick", function(){
//     localStorage.clear()
//     urlListOne = []
//     textArea.value = ""
//     ul.innerHTML = ""
//     render(urlListOne)
// })

//Replace below code with removeBtn snippet to add Undo function

// for (let removeBtn of removeBtns){
//     removeBtn.addEventListener("click", function(){
//         let index = this.id

//         //For adding undo function
//         // 1. Store every undo in a array with index position equal to the delete button id
//         // 2. Change list item id to deleted and give it delete button id
//         // 3. If undo button is clicked, change ul html to undo array element with index equal to undo button clicked
//         // 4. Set timeout function 3 seconds for every list item after which if list item id is equal to deleted then delete the list and clear from local storage

//         undo[index] = document.getElementById(`list-item-${index}`).innerHTML
//         let height = document.getElementById(`list-item-${index}`).clientHeight
//         document.getElementById(`list-item-${index}`).innerHTML = `
//             <span class="text-deleted">Deleted</span>
//             <button class="undo" id="undo-${index}">Undo</button>`
//         document.getElementById(`list-item-${index}`).style.height = `${height-10}px`
//         document.getElementById(`list-item-${index}`).id = `deleted-${index}`

//         document.getElementById(`undo-${index}`).addEventListener("click", ()=>{
//             document.getElementById(`deleted-${index}`).innerHTML = undo[index]
//             document.getElementById(`deleted-${index}`).id = `list-item-${index}`
//             window.location.reload();
//         })

//         setTimeout(()=>{
//             if (document.getElementById(`undo-${index}`).parentElement.id == `deleted-${index}`){
//                 urlListOne.splice(index - 1, 2)
//                 render(urlListOne)
//                 localStorage.setItem("urlListOne", JSON.stringify(urlListOne))
//                 window.location.reload();
//             }
//         }, 2500)
//     });
// }

// For Dropdown
// <button id="${j}" type="button" class = "dropdown-icon"><i class="fa-solid fa-square-caret-down"></i></button>