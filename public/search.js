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