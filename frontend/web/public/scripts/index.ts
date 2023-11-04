//region test

 if (true){
     console.log("dei mum")
 }

fetch('http://localhost:8080/equipment/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: 'Lumix S5ii'})
})
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error));

 fetch("http://localhost:8080/equipment/getbyid/1/getname")
     .then(result => {
         console.log(result)
         return result.text()
     })
     .then(data => {
         document.querySelector('p').innerText = data
     })

 //endregion