/* Checklist when page refreshes
1. Check if tab details are stored in local storage. If yes, then print the details. If no, then create 4 lists and print. Disable right click on them
2. Print the details in dropdown menu too.
3. If there are more than 4 tabs stored, then decrease the width of tabs to 22%, else it is 25%
4. Check if tab number is stored in local storage, if yes then make that tab active. Else, make first tab active
5. Print the list corresponding to the tab number opened. If currently opened tab is already saved in any list then show the notification that its saved.
6. Add copy, rename and remove functions to links
*/

import {URLcheck} from '/url-print-check.js'

let tabCount, ul
let allLists = []
let textArea = document.getElementById("textArea")
const saveURLBtn = document.getElementById("saveURLButton")
const removeBtns = document.getElementsByClassName("removeBtns")
const copyBtns = document.getElementsByClassName("copyBtns")
const renameBtns = document.getElementsByClassName("renameBtns")
const tabs = document.getElementsByClassName("tab")
const tabListsContainer = document.querySelector("#tab-lists-container")
const allTabs = document.getElementsByClassName("linkTabs")[0]
// let undo = [""]

let tabCache = JSON.parse(localStorage.getItem("tabCache"))
let tabDetails = JSON.parse(localStorage.getItem("tabDetails"))

//Printing all the list tabs by getting info from local storage
//If it doesn't exist then print 4 list tabs and save in local storage

if (tabDetails){
    tabCount = tabDetails.length
    for (let i=0; i<tabCount; i++){
        if (tabDetails[i].length < 12){
            allTabs.innerHTML += `
            <li class="tab-list" title="${tabDetails[i]}"><button class="tab" id="${i+1}"><i class="fa-solid fa-circle not-empty-dot empty"></i> ${tabDetails[i]}</button></li>`
        } else {
            allTabs.innerHTML += `
            <li class="tab-list" title="${tabDetails[i]}"><button class="tab" id="${i+1}"><i class="fa-solid fa-circle not-empty-dot empty"></i> ${tabDetails[i].slice(0,10)}..</button></li>`
        }
        document.getElementById("link-list").innerHTML += `
        <ul id="ul-${i+1}"></ul>`
    }
} else {
    tabDetails = ["List 1", "List 2", "List 3", "List 4", "List 5"]
    localStorage.setItem("tabDetails", JSON.stringify(tabDetails))
    tabCount = tabDetails.length
    for (let i=0; i<tabCount; i++){
        allTabs.innerHTML += `
            <li class="tab-list"><button class="tab" id="${i+1}"><i class="fa-solid fa-circle not-empty-dot empty"></i> ${tabDetails[i]}</button></li>`
        document.getElementById("link-list").innerHTML += `
            <ul id="ul-${i+1}"></ul>`
    }
}

const leftArrow = document.getElementById("left-arrow")
const rightArrow = document.getElementById("right-arrow")

setTimeout(function(){
    allTabs.scrollLeft = 99*(tabCache - 1)
    if (tabCache === 1){
        leftArrow.classList.add("no-scroll")
    }
    if (tabCache === tabDetails.length){
        rightArrow.classList.add("no-scroll")
    }
}, 10)

// Making lists in local storage for every tab
if (!JSON.parse(localStorage.getItem("allLists"))){
    for (let i = 0; i< tabDetails.length; i++){
        allLists.push([""])
        localStorage.setItem(`allLists`, JSON.stringify(allLists))
    }
}

if (allTabs.scrollWidth > "490"){
    leftArrow.style.display = "flex"
    rightArrow.style.display = "flex"
}

leftArrow.addEventListener("click", function(){
    allTabs.scrollLeft += -99
    if (tabs[tabCache-2])
        tabs[tabCache-2].click()
    if (tabCache != 1){
        leftArrow.classList.remove("no-scroll")
    } else {
        leftArrow.classList.add("no-scroll")
    }
    rightArrow.classList.remove("no-scroll")
})

rightArrow.addEventListener("click", function(){
    allTabs.scrollLeft += 99
    if (tabs[tabCache])
        tabs[tabCache].click()
    if (tabCache != tabDetails.length){
        rightArrow.classList.remove("no-scroll")
    } else {
        rightArrow.classList.add("no-scroll")
    }
    leftArrow.classList.remove("no-scroll")
})

// Show a note if currently opened tab is also saved in any of lists
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    let count=0, listCount=0, linkInListCount = 0, previousListIndex = ""
    allLists = JSON.parse(localStorage.getItem("allLists"))
    for (let list of allLists){
        for (let link of list){
            if(tabs[0].title === link){
                count = count+1
                linkInListCount += 1
                document.getElementById("already-saved").classList.add("show")
                if (count === 1) {
                    listCount += 1
                    document.getElementById("already-saved").innerHTML += `<span class="already-saved-list-name" id="saved-list-index-${allLists.indexOf(list)}"><b>${tabDetails[allLists.indexOf(list)]}`
                    previousListIndex = allLists.indexOf(list)
                } else if (previousListIndex != allLists.indexOf(list)) {
                    listCount += 1
                    document.getElementById("already-saved").innerHTML += `, <span class="already-saved-list-name" id="saved-list-index-${allLists.indexOf(list)}"><b>${tabDetails[allLists.indexOf(list)]}`                    
                    previousListIndex = allLists.indexOf(list)
                }
            }
        }
    }
    document.getElementById("already-saved").innerHTML += "."
})

//For every URL saved, two indexes are used in the 'list1' array.
//First index is used for saving the link.
//Second index is used for title.

//Save current tab
document.getElementById("saveTab").addEventListener("click", function(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        for (let i=0; i < tabDetails.length; i++){
            if (document.getElementsByClassName("tab")[i].classList.contains("active")){
                allLists[i].unshift(`${tabs[0].title}`);
                allLists[i].unshift(`${tabs[0].url}`);
                render(allLists[i])
                render(allLists[(tabCache) - 1])
                document.getElementById(`ul-${tabCache}`).innerHTML = ul
                localStorage.setItem("allLists", JSON.stringify(allLists))
                window.location.reload();
            }
        }
    })
})

const addManually = document.getElementById("add-manually")
const cancelAddManually = document.getElementById("cancel-manually")

//Add manually
addManually.addEventListener("click", function(){
    addManually.style.display = "none"
    document.getElementById("saveTab").style.display = "none"
    document.getElementById("save-url").style.display = "flex"
    textArea.focus()
    cancelAddManually.style.display = "block"
    cancelAddManually.addEventListener("click", function(){
        cancelAddManually.style.display = "none"
        addManually.style.display = "block"
        document.getElementById("save-url").style.display = "none"
        document.getElementById("saveTab").style.display = "block"
    })
})

//Save URL from input placeholder
saveURLBtn.addEventListener("click", function(){
    if ( textArea.value && textArea.value.indexOf(" ") !=0 ){
        for (let i=0; i < tabDetails.length; i++){
            if (document.getElementsByClassName("tab")[i].classList.contains("active")){
                URLcheck(allLists[i])
                render(allLists[i])
                localStorage.setItem("allLists", JSON.stringify(allLists))
                textArea.value = ""
                window.location.reload();
            }
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

//Opening and closing Tab lists dropdown menu
document.querySelector("#tab-list-container").addEventListener("click", function(){
    if (tabListsContainer.classList.contains("open")){
        tabListsContainer.classList.remove("open") 
    } else {
        tabListsContainer.classList.add("open")
        for (let dropList of document.getElementsByClassName("dropdown-menu-tab")){
            dropList.classList.remove("selected")
            if (dropList.innerText.length > 10){
                dropList.innerText = `${dropList.innerText.slice(0,10)}...`
            }
            dropList.addEventListener("click", function(){                
                if (dropList.id.slice(-2) < 10) {
                    tabCache = dropList.id.slice(-1)
                } else {
                    tabCache = dropList.id.slice(-2)
                }
                localStorage.setItem("tabCache", JSON.stringify(tabCache))
                tabs[tabCache - 1].click()
                allTabs.scrollLeft = 99*(tabCache - 1)
                if (tabCache === 1){
                    leftArrow.classList.add("no-scroll")
                }
                if (tabCache === tabDetails.length){
                    rightArrow.classList.add("no-scroll")
                }
            })
        }
        document.getElementById(`dropdown-menu-tab-${tabCache}`).classList.add("selected")
        if (tabCache > 4){
            tabListsContainer.scrollTop = 33*tabCache
        }
    }
})

allTabs.addEventListener('wheel', function(e) {
    e.preventDefault();
  }, { passive: false });

//Printing list of tabs in tab lists dropdown menu
let tabId=1
for (let tab of tabDetails){
        tabListsContainer.innerHTML += `
        <li class="dropdown-menu-tab dropdown-active" id="dropdown-menu-tab-${tabId}" title="${tab}">${tab} <i class="fa-solid fa-circle not-empty-dot empty"></i></li>`
    tabId = tabId + 1
}

//Closing more options menu or tab list container by clicking outside of the container
document.addEventListener("click", function(event){
    if (tabListsContainer.classList.contains("open")){
        if(!document.querySelector("#tab-list-container").contains(event.target) || tabListsContainer.contains(event.target)){
            tabListsContainer.classList.remove("open")
        }
    }
})

//Storing the tab number that is currently active so that it gets opened in next session
if (tabCache){
    setTimeout(function(){
        tabs[tabCache - 1].click()
    }, 50)
} else {
    setTimeout(function(){
        tabs[0].click()
    }, 50)
}

//If tab number stored in local storage becomes more than actual tab count, then make first list active
if (tabCache > tabDetails.length){
    tabCache = 1
    localStorage.setItem("tabCache", JSON.stringify(tabCache))
    tabs[tabCache - 1].click()
}

allLists = JSON.parse(localStorage.getItem("allLists"))

//Clicking the tab and opening the list according to the active tab
for (let tab of tabs){
    render(allLists[tab.id - 1])
    document.getElementById(`ul-${tab.id}`).innerHTML = ul
    tab.addEventListener("click", function(){
        tabCache = this.id
        localStorage.setItem("tabCache", JSON.stringify(tabCache))
        for (let i=0; i<tabs.length; i++){
            tabs[i].classList.remove("active")
            document.getElementById(`ul-${i+1}`).style.display = "none"
        }
        document.getElementById(`dropdown-menu-tab-${tabCache}`).classList.add("selected")
        render(allLists[tabCache - 1])
        document.getElementById(`ul-${(this.id)}`).style.display = "block"
        this.classList.add("active")
        document.getElementsByClassName("menu-btn")[0].innerHTML = `${tab.innerText} &nbsp;<i class="fa-solid fa-caret-down"></i>`
    })
}

//Print list if stored in local storage
if (allLists){
    render(allLists[(tabCache) - 1])
    document.getElementById(`ul-${tabCache}`).innerHTML = ul
} else {
    localStorage.setItem("allLists", JSON.stringify(allLists))
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
        ul = listItem
    }
}

let index, listItemNo
allLists = JSON.parse(localStorage.getItem("allLists"))

//Copy Button for URLs
setTimeout(function(){
for (let copyBtn of copyBtns){
    copyBtn.addEventListener("click", function(){
        listItemNo = this.id
        const body = document.querySelector('body');
        const area = document.createElement('textarea');
        body.appendChild(area);
        
        area.value = allLists[tabCache - 1][listItemNo - 1];
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
        renameURLHeading.innerHTML = `Rename URL: <span style="color: #2187e5;">${allLists[tabCache - 1][index]}</span>`
        renameURLInputBox.focus()
        renameURLSaveBtn.addEventListener("click", function(){
            if (renameURLInputBox.value){
                allLists[tabCache - 1][index] = renameURLInputBox.value
                renameURLInputBox.value = ""
                renameURLmodal.close()
                render(allLists[tabCache - 1])
                localStorage.setItem("allLists", JSON.stringify(allLists))
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
        allLists[tabCache - 1].splice(index - 1, 2)
        render(allLists[tabCache - 1])
        localStorage.setItem("allLists", JSON.stringify(allLists))
        window.location.reload()
    })
}
}, 50)

//Add new list button
const newListBtn = document.getElementById("add-new-list-btn")
const newListModal = document.getElementById("add-new-list-modal")
const newListInput = document.getElementById("add-new-list-input-box")
const newListSaveBtn = document.getElementById("add-new-list-save-button")
const closeNewListModal = document.getElementById("add-new-list-cancel-button")

newListBtn.addEventListener("click", function(){
    newListModal.showModal()
    newListSaveBtn.addEventListener("click", function(){
    if (newListInput.value){
            tabDetails.push(newListInput.value)
            localStorage.setItem("tabDetails", JSON.stringify(tabDetails))
            allLists.push([""])
            localStorage.setItem("allLists", JSON.stringify(allLists))
            tabCache = JSON.parse(localStorage.getItem("tabDetails")).length
            localStorage.setItem(`tabCache`, JSON.stringify(tabCache))
            window.location.reload()
        } else {
            newListInput.style.border = "2px solid red"
        }
    })
    newListInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault()
          newListSaveBtn.click()
        }
    })
    closeNewListModal.addEventListener("click", function(){
        newListModal.close()
    })
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
                allTabs.innerHTML += `
                <li class="tab-list"><button class="tab" id="${i+1}">${tabDetails[i]}</button></li>`
                document.getElementById("link-list").innerHTML += `
                <ul id="ul-${i+1}"></ul>`
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
            removeListInput.value = ""
            allLists.splice(index-1, 1)
            localStorage.setItem("allLists", JSON.stringify(allLists))
            tabCount = tabDetails.length
            if (tabCount<4){
                document.getElementById("add-new-list-btn").click()
            }
            tabs[index-1].click()
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