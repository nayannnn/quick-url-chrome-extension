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

function render(list){
    let listItem = ""
    for (let j=0; j<list.length; j++){
        listItem += `
        <li>
            <a href="${list[j]}" target="_blank">${list[j]}</a>
        </li>`
        ul.innerHTML = listItem
    }
}

resetBtn.addEventListener("click", function(){
    localStorage.clear()
    myLeads = []
    textArea.value = ""
    render(myLeads)
})