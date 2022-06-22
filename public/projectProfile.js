let deleteEvent = document.getElementById('deleteEvent')

  deleteEvent.addEventListener('click', function(){
   let eventId = this.getAttribute('data-id')
   console.log('EVENTID',eventId)
    fetch('/deleteEvent', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'eventId':eventId
      })
    }).then(function (response) {
      window.location.reload()
    })
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
