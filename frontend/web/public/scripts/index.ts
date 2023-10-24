//region test

 if (true){
     console.log("dei sfdasdfasdf")
 }

 fetch("http://localhost:8080/equipment/list")
     .then(result => {
         console.log(result)
         return result.text()
     })
     .then(data => {
         document.querySelector('p').innerText = data
     })

 //endregion