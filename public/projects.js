let title = document.getElementsByClassName('title').innerHTML
let splitTitle = title.split(" ")
let characters = title.split("")
let abbreviatedTitle = []
let maxChar = 0

console.log(splitTitle, characters)

if (characters.length > 20){
    for (let i=0;i < splitTitle.length;i++){
        maxChar += splitTitle[i].length
        if (maxChar <= 20){
            abbreviatedTitle.push(splitTitle[i])
        }
        title = abbreviatedTitle.join(' ')
    }
}

