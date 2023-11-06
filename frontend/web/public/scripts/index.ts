//region test

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

interface column{
    name: string,
    inputType: string
}

const columns:column[] = [
    {name: "Gerät Nr.", inputType: "number"},
    {name: "Zubehör", inputType: "text"},
    {name: "Entlehner*in + Klasse", inputType: "text"},
    {name: "Entlehnung Datum", inputType: "date"},
    {name: "Unterschrift Entlehner*in", inputType: "checkbox"},
    {name: "Paraphe Lehkraft", inputType: "text"},
    {name: "Rückgabe geplant", inputType: "date"},
    {name: "Rückgabe tatsächlich", inputType: "date"},
    {name: "Unterschrift Entlehner*in", inputType: "checkbox"},
    {name: "Paraphe Lehkraft", inputType: "text"},
    {name: "Anmerkung", inputType: "text"},
]

generateTable(20)
function generateTable(rowCount: number){
    let headingHtml = document.createElement("tr")
    let rowHtml = document.createElement("tr")

    //ATTENTION this approach only works as long as you dont keep this logic when updating to any kind of data storrage logic
    //if it is kept this way, all rows would have the same content since they are made from the same row
    //nvm i think this works.. its ugly code tho sry guys

    columns.forEach(column=>{
        let headRow = document.createElement("th")
        headRow.innerText = column.name
        headingHtml.appendChild(headRow)

        let cell = document.createElement("td")

        let cellinput = document.createElement("input")
            cellinput.type = column.inputType
            cell.appendChild(cellinput)

        switch (column.inputType) {
            case "number":
                cellinput.setAttribute("min", "0");
                break
        }

        if(column.name === "Entlehner*in + Klasse"){
            cellinput.onclick = openStudentPicker
        }

        rowHtml.appendChild(cell)
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

function openStudentPicker(e){
    
}