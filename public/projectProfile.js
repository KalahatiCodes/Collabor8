let likes = document.getElementsByClassName("bi-hand-thumbs-up");
let trash = document.getElementsByClassName("bi-trash");



Array.from(likes).forEach(function(element) {
  element.addEventListener('click', function(){
    const comment = this.parentNode.parentNode.childNodes[1].innerText
    const likes = parseFloat(this.parentNode.parentNode.childNodes[3].innerText)
    fetch('/newLike', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'comment': comment,
        'likes':likes,
        'action': 'like'
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

let deleteRepo = document.getElementById('deleteRepo')

  deleteRepo.addEventListener('click', function(){
   let projectId = this.getAttribute('data-id')
   console.log(projectId)
    fetch('/deleteRepo', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'projectId':projectId
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
