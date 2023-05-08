import {URLcheck} from '/url-print-check.js'

let tabCache, tabCount
let listnames = []
let tabDetails = [""]
let textArea = document.getElementById("textArea")
const saveURLBtn = document.getElementById("saveURLButton")
const removeBtns = document.getElementsByClassName("removeBtns")
const copyBtns = document.getElementsByClassName("copyBtns")
const renameBtns = document.getElementsByClassName("renameBtns")
const tabs = document.getElementsByClassName("tab")
// let undo = [""]

//Printing all the list tabs by getting info from local storage
//If it doesn't exist then print 4 list tabs and save in local storage
if (JSON.parse(localStorage.getItem("tabDetails"))){
    tabDetails = JSON.parse(localStorage.getItem("tabDetails"))
    tabCount = tabDetails.length
    for (let i=0; i<tabCount; i++){
        document.getElementsByClassName("linkTabs")[0].innerHTML += `
        <li class="tab-list"><button class="tab" id="${i+1}">${tabDetails[i]}</button></li>`
        document.getElementById("link-list").innerHTML += `
        <ul id="ul-el-${i+1}"></ul>`
    }
} else {
    tabDetails = ["List 1", "List 2", "List 3", "List 4"]
    localStorage.setItem("tabDetails", JSON.stringify(tabDetails))
    tabCount = tabDetails.length
    for (let i=0; i<tabCount; i++){
        document.getElementsByClassName("linkTabs")[0].innerHTML += `
            <li class="tab-list"><button class="tab" id="${i+1}">${tabDetails[i]}</button></li>`
        document.getElementById("link-list").innerHTML += `
            <ul id="ul-el-${i+1}"></ul>`
    }
}

//Changing width of tabs if tab count is more than 4
if (tabCount === 4){
    document.getElementsByClassName("linkTabs")[0].style.gridAutoColumns = "25%"
}  else {
    document.getElementsByClassName("linkTabs")[0].style.gridAutoColumns = "22%"
}

//Restoring scroll position of tab menu by getting info from local storage
document.getElementsByClassName("linkTabs")[0].scrollLeft = 122.5*((JSON.parse(localStorage.getItem("tabCache")))-1)

setTimeout(function(){
    if (JSON.parse(localStorage.getItem("scrollpos"))){
        document.getElementById("allLinks").scrollTop = JSON.parse(localStorage.getItem("scrollpos"))
    }
}, 50)

// Making lists in local storage for every tab
for (let i = 0; i< tabDetails.length; i++){
    if (JSON.parse(localStorage.getItem(listnames[i]))){

    } else {
        listnames.push([])
        localStorage.setItem(`listnames`, JSON.stringify(listnames))
    }
}

document.getElementsByClassName("linkTabs")[0].addEventListener("contextmenu", function(){
    event.preventDefault();
})

//For every URL saved, two indexes are used in the 'list1' array.
//First index is used for saving the link.
//Second index is used for title.

//Save current tab
document.getElementById("saveTab").addEventListener("click", function(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        for (let i=0; i < tabDetails.length; i++){
            if (document.getElementsByClassName("tab")[i].classList.contains("active")){
                listnames[i].unshift(`${tabs[0].title}`);
                listnames[i].unshift(`${tabs[0].url}`);
                render(listnames[i])
                localStorage.setItem("listnames", JSON.stringify(listnames))
                // window.location.reload();
            }
        }
    })
})

//Save URL from input placeholder
saveURLBtn.addEventListener("click", function(){
    if ( textArea.value && textArea.value.indexOf(" ") !=0 ){
        if (document.getElementsByClassName("tab")[0].classList.contains("active")){
            URLcheck(listnames[0])
            render(listnames[0])
            localStorage.setItem("listnames", JSON.stringify(listnames))
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
      event.preventDefault()
      saveURLBtn.click()
    }
})

//Opening and closing more options menu
document.querySelector("#more-btn-container").addEventListener("click", function(){
    if (document.querySelector("#more-btns-container").classList.contains("open")){
        document.querySelector("#more-btns-container").classList.remove("open") 
    } else {
        document.querySelector("#more-btns-container").classList += "open"
    }
})

//Closing more options menu by clicking outside of the container
document.addEventListener("click", function(event){
    if (document.querySelector("#more-btns-container").classList.contains("open")){
        if(!document.querySelector("#more-btn-container").contains(event.target)){
            document.querySelector("#more-btns-container").classList.remove("open")
        }
    }
})

//Add new list button
document.getElementById("add-new-list-btn").addEventListener("click", function(){
    tabDetails.push(`New List`)
    localStorage.setItem("tabDetails", JSON.stringify(tabDetails))
    window.location.reload()
})

//Renaming title of lists
const renameListBtn = document.getElementById("rename-list-btn")
const renameListModal = document.getElementById("rename-list-modal")
const renameListHeading = document.getElementById("rename-list-modal-heading")
const renameListInput = document.getElementById("rename-list-input-box")
const renameListSaveBtn = document.getElementById("rename-list-save-button")
const closeRenameListModal = document.getElementById("rename-list-cancel-button")

renameListBtn.addEventListener("click", function(){
    let index
    for (let tab of tabs){
        if (tab.classList.contains("active")){
            index = tab.id
        }
    }
    renameListModal.showModal()
    renameListHeading.innerHTML = `Rename list: <span style="color: #2187e5;">${tabDetails[index-1]}</span>`
    renameListSaveBtn.addEventListener("click", function(){
        if (renameListInput.value){
            tabDetails[index-1] = renameListInput.value
            renameListInput.value = ""
            localStorage.setItem("tabDetails", JSON.stringify(tabDetails))
            tabDetails = JSON.parse(localStorage.getItem("tabDetails"))
            tabCount = tabDetails.length
            for (let i=0; i<tabCount; i++){
                document.getElementsByClassName("linkTabs")[0].innerHTML += `
                <li class="tab-list"><button class="tab" id="${i+1}">${tabDetails[i]}</button></li>`
                document.getElementById("link-list").innerHTML += `
                <ul id="ul-el-${i+1}"></ul>`
            }
            renameListModal.close()
            window.location.reload()
        } else {
            renameListInput.style.border = "2px solid red"
        }
    })
    renameListInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault()
          renameListSaveBtn.click()
        }
    })
    closeRenameListModal.addEventListener("click", function(){
        renameListModal.close()
    })
})

//Removing a list by making user first type something in an input box
const removeListBtn = document.getElementById("remove-list-btn")
const removeListModal = document.getElementById("remove-list-modal")
const removeListHeading = document.getElementById("remove-list-modal-heading")
const removeListInput = document.getElementById("remove-list-input-box")
const removeListYes = document.getElementById("remove-list-yes-button")
const closeRemoveListModal = document.getElementById("remove-list-cancel-button")

removeListBtn.addEventListener("click", function(){
    let index
    for (let tab of tabs){
        if (tab.classList.contains("active")){
            index = tab.id
        }
    }
    removeListModal.showModal()
    removeListHeading.innerHTML = `Type <span style= "color: #af1d1d;">remove</span> to remove <span style="color: #2187e5">${tabDetails[index-1]}</span> from your collection?`
    removeListYes.addEventListener("click", function(){
        tabDetails = JSON.parse(localStorage.getItem("tabDetails"))
        if (removeListInput.value === "remove"){
            tabDetails.splice(index-1, 1)
            localStorage.setItem("tabDetails", JSON.stringify(tabDetails))
            if ((index-1) === 0){
                localStorage.removeItem("listnames[0]")
            }
            removeListInput.value = ""
            window.location.reload()
        } else {
            removeListInput.style.border = "2px solid red"
        }
    })
    removeListInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault()
          removeListYes.click()
        }
    })
    closeRemoveListModal.addEventListener("click", function(){
        removeListInput.value = ""
        removeListModal.close()    
    })
})

//If a list is removed, and total count of lists get less than 4, then add a new list
if (tabCount<4){
    tabDetails.push("New list")
    localStorage.setItem("tabDetails", JSON.stringify(tabDetails))
    window.location.reload()
}

//Storing the tab number that is currently active so that it gets opened in next session
if (JSON.parse(localStorage.getItem("tabCache"))){
    setTimeout(function(){
        tabCache = JSON.parse(localStorage.getItem("tabCache"))
        tabs[tabCache - 1].click()
    }, 100)
} else {
    setTimeout(function(){
        tabs[0].click()
    }, 100)
}

//If tab number stored in local storage becomes more than actual tab count, then make first list active
if (JSON.parse(localStorage.getItem("tabCache")) > tabDetails.length){
    tabCache = 1
    localStorage.setItem("tabCache", JSON.stringify(tabCache))
    tabs[tabCache - 1].click()
}

//Opening the list according to the active tab
for (let tab of tabs){
    tab.addEventListener("click", function(){
        tabCache = this.id
        localStorage.setItem("tabCache", JSON.stringify(tabCache))
        for (let i=0; i<tabs.length; i++){
            tabs[i].classList.remove("active")
            document.getElementById(`ul-el-${i+1}`).style.display = "none"
        }
        document.getElementById(`ul-el-${(this.id)}`).style.display = "block"
        this.classList.add("active")
    })
}

//Print list if stored in local storage
if (JSON.parse(localStorage.getItem("listnames"))){
    listnames = JSON.parse(localStorage.getItem("listnames"))
    render(listnames[0])
} else {
    localStorage.setItem("listnames", JSON.stringify(listnames))
}

//Printing the list
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
                        <a style="cursor: auto;"><span class= "tabTitle" title = "${url}">${url}</span></a>
                        <div class = "listBtnBox">
                            <button id="${j}" type="button" class="listButtons copyBtns"><i class="fa-solid fa-copy list-icons icon-copy"></i>Copy</button>                            
                            <button id="${j}" type="button" class="listButtons renameBtns"><i class="fa-solid fa-pen-to-square list-icons icon-rename"></i>Rename</button>
                            <button id="${j}" type="button" class="listButtons removeBtns"><i class="fa-solid fa-trash list-icons icon-remove"></i>Remove</button>
                        </div>
                    </li>`
                } else {
                    listItem += `
                    <li class = "list-item" id="list-item-${j}">
                        <a href="${url}" target="_blank"><span class= "tabTitle" title = "${url}">${url}</span></a>
                        <div class = "listBtnBox">
                            <button id="${j}" type="button" class="listButtons copyBtns"><i class="fa-solid fa-copy list-icons icon-copy"></i>Copy</button>
                            <button id="${j}" type="button" class="listButtons renameBtns"><i class="fa-solid fa-pen-to-square list-icons icon-rename"></i>Rename</button>
                            <button id="${j}" type="button" class="listButtons removeBtns"><i class="fa-solid fa-trash list-icons icon-remove"></i>Remove</button>
                        </div>
                    </li>`
                }
            } else {
                listItem += `
                <li class = "list-item" id="list-item-${j}">
                    <a href="${url}" target="_blank"><span class= "tabTitle">${list[j]}</span> <span class="tabUrl" title = "${url}">${url}</span></a>
                    <div class = "listBtnBox">
                        <button id="${j}" type="button" class="listButtons copyBtns"><i class="fa-solid fa-copy list-icons icon-copy"></i>Copy</button>
                        <button id="${j}" type="button" class="listButtons renameBtns"><i class="fa-solid fa-pen-to-square list-icons icon-rename"></i>Rename</button>
                        <button id="${j}" type="button" class="listButtons removeBtns"><i class="fa-solid fa-trash list-icons icon-remove"></i>Remove</button>
                    </div>
                </li>`
            }
        }
        document.getElementById("ul-el-1").innerHTML = listItem
    }
}

let index

//Copy Button for URLs
for (let copyBtn of copyBtns){
    copyBtn.addEventListener("click", function(){
        index = this.id
        const body = document.querySelector('body');
        const area = document.createElement('textarea');
        body.appendChild(area);
        
        area.value = listnames[0][index - 1];
        navigator.clipboard.writeText(area.value)
        this.innerHTML = `<i class="fa-solid fa-square-check list-icons"></i></i>Copied`

        body.removeChild(area);
        setTimeout(function(){
            copyBtn.innerHTML = `<i class="fa-solid fa-copy list-icons icon-copy"></i>Copy`
        }, 1000)
    })
}

//Renaming title of URLs
const renameURLmodal = document.getElementById("rename-url-modal")
const renameURLInputBox = document.getElementById("rename-url-input-box")
const renameURLHeading = document.getElementById("rename-url-modal-heading")
const renameURLSaveBtn = document.getElementById("rename-url-save-button")
const renameURLCloseBtn = document.getElementById("rename-url-cancel-button")

for (let renameBtn of renameBtns){
    renameBtn.addEventListener("click", function(){
        renameURLmodal.showModal()
        index = this.id
        renameURLHeading.innerHTML = `Rename URL: <span style="color: #2187e5;">${listnames[0][index]}</span>`
        renameURLInputBox.focus()
        renameURLSaveBtn.addEventListener("click", function(){
            if (renameURLInputBox.value){
                listnames[0][index] = renameURLInputBox.value
                renameURLInputBox.value = ""
                renameURLmodal.close()
                render(listnames[0])
                localStorage.setItem("listnames", JSON.stringify(listnames))
                window.location.reload()
            } else {
                renameURLInputBox.style.border = "2px solid red"
            }
        })
        renameURLCloseBtn.addEventListener("click",function(){
            renameURLmodal.close()
        })
        renameURLInputBox.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              event.preventDefault()
              renameURLSaveBtn.click()
            }
        })
    })
}

//Remove button for URLs
for (let removeBtn of removeBtns){
    removeBtn.addEventListener("click", function(){
        index = this.id
        listnames[0].splice(index - 1, 2)
        render(listnames[0])
        localStorage.setItem("listnames", JSON.stringify(listnames))
        localStorage.setItem('scrollpos', document.getElementById("allLinks").scrollTop);
        window.location.reload()
    })
}














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
//                 list1.splice(index - 1, 2)
//                 render(list1)
//                 localStorage.setItem("list1", JSON.stringify(list1))
//                 window.location.reload();
//             }
//         }, 2500)
//     });
// }