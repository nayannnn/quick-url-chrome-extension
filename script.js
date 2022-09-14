let links = [""]
let textArea = document.getElementById("textArea")
const saveURLBtn = document.getElementById("saveURL")
const resetBtn = document.getElementById("reset")
const ul = document.getElementById("ul-el")
const deleteBtns = document.getElementsByClassName("dltBtn")
const copyBtns = document.getElementsByClassName("copyBtns")

if (JSON.parse(localStorage.getItem("links"))){
    links = JSON.parse(localStorage.getItem("links"))
    render(links)
}

saveURLBtn.addEventListener("click", function(){
    if (textArea.value){
        if (textArea.value.toLowerCase().indexOf("https://") == 0 || textArea.value.toLowerCase().indexOf("http://") == 0){
            links.unshift(textArea.value, textArea.value)
        } else if (textArea.value.toLowerCase().indexOf("www.") == 0){
            links.unshift(`https://${textArea.value}`, `https://${textArea.value}`)
        } else{
            links.unshift(`https://www.${textArea.value}`, `https://www.${textArea.value}`)
        }
        render(links)
        localStorage.setItem("links", JSON.stringify(links))
        textArea.value = ""
        window.location.reload();
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
                listItem += `
                <li>
                    <a href="${url}" target="_blank"><span class= "tabTitle">${url}</span></a>
                    <div class = "listBtnContainer">
                        <button id="${j}" type="button" class="listButtons copyBtns">Copy</button>
                        <button id="${j}" type="button" class="listButtons dltBtn">Delete</button>
                    </div>
             </li>`
            } else {
                listItem += `
                <li>
                    <a href="${url}" target="_blank"><span class= "tabTitle">${list[j]}</span> (<span class="tabUrl">${url}</span>)</a>
                    <div class = "listBtnContainer">
                        <button id="${j}" type="button" class="listButtons copyBtns">Copy</button>
                        <button id="${j}" type="button" class="listButtons dltBtn">Delete</button>
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
        links.splice(this.id - 1, 2)
        render(links)
        localStorage.setItem("links", JSON.stringify(links))
        window.location.reload();
    });
}

resetBtn.addEventListener("dblclick", function(){
    localStorage.clear()
    links = []
    textArea.value = ""
    ul.innerHTML = ""
    render(links)
})