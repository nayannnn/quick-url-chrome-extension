export function URLcheck(links){
    if (textArea.value.toLowerCase().indexOf("https://") == 0 || textArea.value.toLowerCase().indexOf("http://") == 0){
            links.unshift(textArea.value, textArea.value)
        } else if (textArea.value.toLowerCase().indexOf("www.") == 0){
            links.unshift(`https://${textArea.value}`, `https://${textArea.value}`)
        } else if (textArea.value.includes(" ") || (textArea.value.includes(".") == false)) {
            links.unshift(`${textArea.value}`, `${textArea.value}`)
        } else if (textArea.value.includes(`mailto:`) && textArea.value.includes("@") && textArea.value.includes(".com")){
            links.unshift(`${textArea.value}`, `${textArea.value}`)
        } else if (textArea.value.includes("@") && textArea.value.includes(".com")) {
            links.unshift(`mailto:${textArea.value}`, `${textArea.value}`)
        } else{
            links.unshift(`https://www.${textArea.value}`, `https://www.${textArea.value}`)
        }
}

// export function URLprint(list, index, url, listItem){
//     if (list[index] == url){
//         if (list[index].includes(" ") || (list[index].includes(".") == false)){
//             listItem += `
//             <li>
//                 <a style="cursor: auto;"><span class= "tabTitle">${url}</span></a>
//                 <div class = "listBtnContainer">
//                     <button id="${index}" type="button" class="listButtons copyBtns">Copy</button>
//                     <button id="${index}" type="button" class="listButtons dltBtn">Delete</button>
//                 </div>
//             </li>`
//         } else {
//             listItem += `
//             <li>
//             <a href="${url}" target="_blank"><span class= "tabTitle">${url}</span></a>
//             <div class = "listBtnContainer">
//             <button id="${index}" type="button" class="listButtons copyBtns">Copy</button>
//             <button id="${index}" type="button" class="listButtons dltBtn">Delete</button>
//             </div>
//             </li>`
//         }
//     } else {
//         listItem += `
//         <li>
//             <a href="${url}" target="_blank"><span class= "tabTitle">${list[index]}</span> (<span class="tabUrl">${url}</span>)</a>
//             <div class = "listBtnContainer">
//                 <button id="${index}" type="button" class="listButtons copyBtns">Copy</button>
//                 <button id="${index}" type="button" class="listButtons dltBtn">Delete</button>
//             </div>
//         </li>`
//     }
// }