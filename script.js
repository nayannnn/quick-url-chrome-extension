let myLeads = []
let textArea = document.getElementById("textArea")
const saveURLBtn = document.getElementById("saveURL")
const resetBtn = document.getElementById("reset")
const ul = document.getElementById("ul-el")

if (JSON.parse(localStorage.getItem("myLeads"))){
    myLeads = JSON.parse(localStorage.getItem("myLeads"))
    render(myLeads)
}

saveURLBtn.addEventListener("click", function(){
    if (textArea.value){    
        myLeads.unshift(textArea.value, textArea.value)
    }
    render(myLeads)
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    textArea.value = ""
})

document.getElementById("saveTab").addEventListener("click", function(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        myLeads.unshift(`${tabs[0].title} -  ${tabs[0].url}`);
        myLeads.unshift(`${tabs[0].url}`);
        render(myLeads)
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
    });
})

function render(list){
    let listItem = ""
    let url = ""
    for (let j=0; j<list.length; j++){
        if (j % 2 == 0){
            url = `${list[j]}`
        } else {
            listItem += `
            <li>
                <a href="${url}" target="_blank">${list[j]}</a>
            </li>`
        } 
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