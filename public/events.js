// DELETE EVENT
let deleteEvent = document.getElementById('deleteEvent')

  deleteEvent.addEventListener('click',function() {
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
      // window.location.reload()
      window.location.replace("/events")
    })
  });