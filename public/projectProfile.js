
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
// RENDER SEARCH RESULTS
let buttonSearch = document.getElementById('buttonSearch')

  buttonSearch.addEventListener('click',function(){
  let searchId = document.getElementsByName("searchItem").value
   console.log(searchId)
    fetch('/searchResults', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'searchId':searchId
      })
    }).then(function (response) {
      window.location.reload()
    })
  });