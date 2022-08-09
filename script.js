let myLeads = []
let textArea = document.getElementById("textArea")
const saveURLBtn = document.getElementById("saveURL")
const resetBtn = document.getElementById("reset")
const ul = document.getElementById("ul-el")
const savedLeads = JSON.parse(localStorage.getItem("myLeads"))

if (savedLeads){
    myLeads = savedLeads
    render(myLeads)
}

saveURLBtn.addEventListener("click", function(){
    if (textArea.value){    
        myLeads.push(textArea.value)
    }
    render(myLeads)
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    textArea.value = ""
})

document.getElementById("saveTab").addEventListener("click", function(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        myLeads.push(tabs[0].url);
        render(myLeads)
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
    });
})

function render(list){
    let listItem = ""
    for (let j=list.length-1; j>-1; j--){
        listItem += `
        <li>
            <a href="${list[j]}" target="_blank">${list[j]}</a>
        </li>`
        ul.innerHTML = listItem
    }
}

resetBtn.addEventListener("dblclick", function(){
    localStorage.clear()
    myLeads = []
    textArea.value = ""
    ul.innerHTML = ""
    render(myLeads)
})