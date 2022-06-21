// Edit About Me Section
let submit2Show = document.getElementById('aboutMeHide')
let aboutMeDescript = document.getElementsById('aboutMeDescript')

submit2Show.addEventListener('click',showAbout)

function showAbout(click){
    aboutMeDescript.classList.toggle('hidden')
}
 


















// Edit Social Media Links
let editSocials = document.getElementById('editSocials')
let editSocialsList = document.getElementById('editSocialsList')
let saveSocials = document.getElementById('saveSocials')
let newTwitterURL = document.getElementById('newTwitterURL').innerHTML
let newLinkedInURL = document.getElementById('newLinkedInURL').innerHTML
let newInstagramURL = document.getElementById('newInstagramURL').innerHTML
let twitterURL = document.getElementById('newTwitterURL').href
let linkedInURL = document.getElementById('newLinkedInURL').href
let instagramURL = document.getElementById('newInstagramURL').href
let socialsList = document.getElementById('socialsList')

editSocials.addEventListener('click', function(){
    editSocialsList.classList.toggle('hidden')
})

saveSocials.addEventListener('click', function(){
    if (newLinkedInURL !== ""){
        let linkedInURL = newLinkedInURL
    }
    if (newInstagramURL !== ""){
        let instagramURL = newInstagramURL
    }
    if (newTwitterURL !== ""){
        let twitterURL = newTwitterURL
    };    
    editSocialsList.classList.toggle('hidden')
})


