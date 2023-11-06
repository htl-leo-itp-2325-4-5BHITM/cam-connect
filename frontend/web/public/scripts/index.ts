
//region test
/*
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
*/
 //endregion

interface column{
    name: string,
    inputType: string,
    cellType: string
}

const columns:column[] = [
    {name: "Gerät Nr.", inputType: "number", cellType: "nr"},
    {name: "Zubehör", inputType: "text", cellType: "extras"},
    {name: "Entlehner*in + Klasse", inputType: "text", cellType: "student"},
    {name: "Entlehnung Datum", inputType: "date", cellType: "rentStart"},
    {name: "Unterschrift Entlehner*in", inputType: "checkbox", cellType: "sigRent"},
    {name: "Paraphe Lehkraft", inputType: "text", cellType: "teacherRent"},
    {name: "Rückgabe geplant", inputType: "date", cellType: "rentEndPlanned"},
    {name: "Rückgabe tatsächlich", inputType: "date", cellType: "rendEndActual"},
    {name: "Unterschrift Entlehner*in", inputType: "checkbox", cellType: "sigReturn"},
    {name: "Paraphe Lehkraft", inputType: "text", cellType: "teacherReturn"},
    {name: "Anmerkung", inputType: "text", cellType: "note"},
]

generateTable(20)
function generateTable(rowCount: number){
    let headingHtml = document.createElement("tr")

    columns.forEach(column=>{
        let headRow = document.createElement("th")
        headRow.innerText = column.name
        headingHtml.appendChild(headRow)
    })

    let table = document.querySelector('table')
    table.appendChild(headingHtml)

    let html:Element[] = []
    for (let i = 0; i < rowCount; i++) {
        let rowHtml = document.createElement("tr")

        columns.forEach(column=>{
            let cell = document.createElement("td")

            let cellinput = document.createElement("input")
            cellinput.type = column.inputType
            cellinput.setAttribute("cellType", column.cellType)

            switch (column.inputType) {
                case "number":
                    cellinput.setAttribute("min", "0");
                    break
            }

            if(column.cellType === "student"){
                cellinput.addEventListener("focus", () => {openStudentPicker(cellinput)})
            }
            cell.appendChild(cellinput)

            rowHtml.appendChild(cell)
        })

        html.push(rowHtml)
    }
    table.append(...html)
}

let studentSelectionPopup:HTMLElement = document.querySelector("#studentSelectionPopup")
function openStudentPicker(input:Element){
    let bounds = input.getBoundingClientRect()
    studentSelectionPopup.style.top = bounds.top + bounds.height + "px"
    studentSelectionPopup.style.left = bounds.left + "px"

    studentSelectionPopup.style.display = "block"

    setTimeout(function(){document.addEventListener("click", closeStudentPicker)},)
}

function closeStudentPicker(e:MouseEvent){
    // @ts-ignore
    if(e.target === studentSelectionPopup || e.target.getAttribute("cellType") === "student") return

    studentSelectionPopup.style.display = "none"
    document.removeEventListener("click", closeStudentPicker)
}