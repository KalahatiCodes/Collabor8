
// DELETE REPOSITORY
let deleteRepo = document.getElementById('deleteRepo')
  deleteRepo.addEventListener('click',function(){
   let projectId = this.getAttribute('data-id')
   console.log(projectId)
    fetch('/deleteRepo', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'projectId': projectId
      })
    }).then(function (response) {
      // window.location.reload()
      window.location.replace("/portfolioPage")
    })
  });
