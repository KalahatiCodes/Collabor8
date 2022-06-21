var addFlower = document.getElementsByClassName("fa-cart-shopping");
var trash = document.getElementsByClassName("fa-trash");
var thumbUp = document.getElementsByClassName("fa-thumbs-up");


Array.from(addFlower).forEach(function(element) {
      element.addEventListener('click', function(){
        const plant = this.parentNode.parentNode.childNodes[1].innerText
        console.log(plant)
        const price = this.parentNode.parentNode.childNodes[3].innerText
        console.log(price)
        fetch('add2Cart', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'plant': plant,
            'price': price
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
        const plant = this.parentNode.parentNode.childNodes[1].innerText
        const price = this.parentNode.parentNode.childNodes[3].innerText
        fetch('add2Cart', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'plant': plant,
            'price': price
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});



var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var remove = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const comment = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'comment': comment,
            'thumbUp':thumbUp
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
Array.from(thumbDown).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const comment = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('thumbDown', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'comment': comment,
        'thumbUp':thumbUp
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
