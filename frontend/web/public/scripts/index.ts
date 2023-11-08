const APPLICATION_URL:String = "http://localhost:8080"

//region test
/*
fetch(APPLICATION_URL + '/equipment/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: 'Lumix S5ii'})
})
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error));

 fetch(APPLICATION_URL + "/equipment/getbyid/1/getname")
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
            cellinput.setAttribute("celltype", column.cellType)

            switch (column.inputType) {
                case "number":
                    cellinput.setAttribute("min", "0");
                    break
            }

            if(column.cellType === "student"){
                cellinput.addEventListener("mouseup", () => {openStudentPicker(cellinput)})
            }
            cell.appendChild(cellinput)

            rowHtml.appendChild(cell)
        })

        html.push(rowHtml)
    }
    table.append(...html)
}


//region student search and selection
const studentSelectionPopup:HTMLElement = document.querySelector("#studentSelectionPopup")
const studentSearchbar:HTMLElement = document.querySelector('#studentSelectionPopup .search')
function openStudentPicker(input:HTMLInputElement){
    input.value = ""
    let bounds = input.getBoundingClientRect()
    studentSelectionPopup.style.top = bounds.top + "px"
    studentSelectionPopup.style.left = bounds.left + "px"

    studentSelectionPopup.style.display = "block"
    studentSearchbar.focus()
    setTimeout(function(){document.addEventListener("mousedown", closeStudentPicker)},)
}

function closeStudentPicker(e:MouseEvent){
    // @ts-ignore
    if(e.target === studentSelectionPopup || e.target.closest('#studentSelectionPopup') === studentSelectionPopup || e.target.getAttribute("celltype") === "student") return
    // @ts-ignore
    studentSelectionPopup.style.display = "none"
    document.removeEventListener("mousedown", closeStudentPicker)
}

interface Student {
    firstname: String,
    lastname: String,
    school_class: String,
    password: String,
    user_id: number
}

/**
 * fetches a list of student names that start with the entered phrase and displays them to the user to select
 * @param inputValue
 */
function searchForStudentFromSelectInput(inputValue:String){
    fetch(APPLICATION_URL + '/student/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({firstname: inputValue})
    })
        .then(response => response.json())
        .then(data => {
            let html:HTMLElement[] = []
            data.forEach((student: string[]) => {
                let selectionOption = document.createElement('p');
                selectionOption.innerText = student[1] + " " + student[2]
                selectionOption.setAttribute("student_id", student[0])
                html.push(selectionOption)
            })
            if(html.length === 0) {
                let noResults = document.createElement('p');
                noResults.classList.add("noResults")
                noResults.innerText = "Keine Ergebnisse"
                html.push(noResults)
            }
            studentSelectionPopup.querySelector(".studentList").replaceChildren(...html)
        })
        .catch(error => console.error(error));
}
//endregion