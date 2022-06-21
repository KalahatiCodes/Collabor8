let likes = document.getElementsByClassName("bi-hand-thumbs-up");
let trash = document.getElementsByClassName("bi-trash");


Array.from(likes).forEach(function(element) {
  element.addEventListener('click', function(){
    const comment = this.parentNode.parentNode.childNodes[1].innerText
    const likes = parseFloat(this.parentNode.parentNode.childNodes[3].innerText)
    let projectId = document.getElementById('id').innerText
    fetch('/newLike', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'comment': comment,
        'likes':likes,
        'action': 'like',
        'projectId': projectId
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

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const comment = this.parentNode.parentNode.childNodes[1].innerText
    fetch('deleteComment/', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'comment': comment
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});