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
         console.log(data)
     })
 //endregion


const headings = [
    "Gerät Nr.", "Zubehör", "Entlehner*in + Klasse", "Entlehnung Datum", "Unterschrift Entlehner*in", "Paraphe Lehkraft", "Rückgabe geplant",
    "Rückgabe tatsächlich", "Unterschrift Entlehner*in", "Paraphe Lehkraft", "Anmerkung"
]

generateTable(20)
function generateTable(rowCount: number){


    let headingHtml = document.createElement("tr")
    let rowHtml = document.createElement("tr")

    //ATTENTION this approach only works as long as you dont keep this logic when updating to any kind of data storrage logic
    //if it is kept this way, all rows would have the same content since they are made from the same row
    headings.forEach(heading=>{
        let headRow = document.createElement("th")
        headRow.innerText = heading
        headingHtml.appendChild(headRow)

        let emptyRow = document.createElement("td")
        emptyRow.appendChild(document.createElement("input"))
        rowHtml.appendChild(emptyRow)
    })

    let table = document.querySelector('table')
    table.innerHTML = ""

    table.appendChild(headingHtml)

    let multiRowHtml = ""
    for (let i = 0; i < rowCount; i++) {
        multiRowHtml += `<tr>${rowHtml.innerHTML}</tr>`
    }
    table.innerHTML += multiRowHtml
}