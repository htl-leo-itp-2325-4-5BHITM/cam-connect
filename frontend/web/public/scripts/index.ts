const APPLICATION_URL:string = "http://localhost:8080"

let allRents:Rent[] = []
let allStudents:Student[] = []
let allTeachers:Teacher[] = []
let editingRentId:number = -1

//region base requests
requestAllStudents()
function requestAllStudents() {
    allStudents = []
    fetch(APPLICATION_URL + "/student/getall")
        .then(result => {
            console.log(result)
            return result.json()
        })
        .then(data => {
            console.log(data)
            let html = []

            data.forEach((student:string[]) => {
                allStudents.push(studentArrayToJson(student))
            })

            //TODO do this with promises
            requestAllTeachers()
        })
        .catch(error => console.error(error))
}
function requestAllTeachers() {
    allTeachers = []
    fetch(APPLICATION_URL + "/teacher/getall")
        .then(result => {
            console.log(result)
            return result.json()
        })
        .then(data => {
            console.log(data)
            let html = []

            data.forEach((teacher:string[]) => {
                allTeachers.push(teacherArrayToJson(teacher))
            })

            requestAllRents()
        })
        .catch(error => console.error(error))
}
function requestAllRents() {
    allRents = []
    fetch(APPLICATION_URL + "/rent/getall")
        .then(result => {
            console.log(result)
            return result.json()
        })
        .then(data => {
            console.log(data)
            let html = []

            data.forEach((rent:string[]) => {
                allRents.push(rentArrayToJson(rent))
            })

            generateTable()
        })
        .catch(error => console.error(error))
}


//endregion

interface Student {
    student_id: number,
    firstname: string,
    lastname: string,
    school_class: string,
    password: string,
    user_id: number
}

interface Teacher {
    teacher_id: number,
    firstname: string,
    lastname: string,
    verification: string,
    password: string,
    user_id: number
}

interface Rent {
    rent_id: number,
    student_id: number,
    device_id: number,
    teacher_id: number,
    rent_start: string,
    rent_end_planned: string,
    rent_end_actual: string,
    note: string
}

//region generate table
interface column{
    name: string,
    inputType: string,
    cellType: string
}

const columns:column[] = [
    {name: "Gerät Nr.", inputType: "number", cellType: "nr"},
    {name: "Zubehör", inputType: "text", cellType: "extras"},
    {name: "Entlehner*in + Klasse", inputType: "text", cellType: "student_id"},
    {name: "Entlehnung Datum", inputType: "date", cellType: "rent_start"},
    {name: "Unterschrift Entlehner*in", inputType: "checkbox", cellType: "sigRent"},
    {name: "Paraphe Lehkraft", inputType: "text", cellType: "teacherRent"},
    {name: "Rückgabe geplant", inputType: "date", cellType: "rent_end_planned"},
    {name: "Rückgabe tatsächlich", inputType: "date", cellType: "rent_end_actual"},
    {name: "Unterschrift Entlehner*in", inputType: "checkbox", cellType: "sigReturn"},
    {name: "Paraphe Lehkraft", inputType: "text", cellType: "teacherReturn"},
    {name: "Anmerkung", inputType: "text", cellType: "note"},
]

function generateTable(){
    let headingHtml = document.createElement("tr")

    columns.forEach(column=>{
        let headRow = document.createElement("th")
        headRow.innerText = column.name
        headingHtml.appendChild(headRow)
    })

    let table = document.querySelector('table')
    table.innerHTML = ""
    table.appendChild(headingHtml)

    let html:Element[] = []
    for (let i = 0; i < Math.min(allRents.length, 20); i++) {
        let row = document.createElement("tr")
        row.setAttribute("rent_id", String(allRents[i]?.rent_id))

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

            switch (column.cellType) {
                case "student_id":
                    cellinput.addEventListener("mouseup", () => {openStudentPicker(cellinput)})
                    cellinput.value = findStudentById(allRents[i]?.student_id)?.firstname || ""
                    break
                case "teacherRent":
                case "teacherReturn":
                    cellinput.value = findTeacherById(allRents[i]?.teacher_id)?.firstname || ""
                    break
                case "note":
                    cellinput.addEventListener("blur", () => {updateNote(cellinput)})
                    cellinput.value = allRents[i]?.note
                    break
                case "rent_start":
                    cellinput.addEventListener("input", () => {updateRentStart(cellinput)})
                    cellinput.value = allRents[i]?.rent_start
            }

            cell.appendChild(cellinput)

            row.appendChild(cell)
        })

        html.push(row)
    }

    table.append(...html)
}

//endregion


//region student search and selection
const studentSelectionPopup:HTMLElement = document.querySelector("#studentSelectionPopup")
const studentSearchbar:HTMLElement = document.querySelector('#studentSelectionPopup .search')
function openStudentPicker(input:HTMLInputElement){
    editingRentId = Number(input.closest("tr").getAttribute("rent_id"))
    searchForStudentFromSelectInput("")
    studentSelectionPopup.querySelector("input").value = ""
    let bounds = input.getBoundingClientRect()
    studentSelectionPopup.style.top = bounds.top + "px"
    studentSelectionPopup.style.left = bounds.left + "px"

    studentSelectionPopup.style.display = "block"
    studentSearchbar.focus()
    setTimeout(function(){document.addEventListener("mousedown", closeStudentPickerOnBlur)},)
}

function closeStudentPickerOnBlur(e:MouseEvent){
    // @ts-ignore
    if(e.target === studentSelectionPopup || e.target.closest('#studentSelectionPopup') === studentSelectionPopup || e.target.getAttribute("celltype") === "student") return

    closeStudentPicker()
    document.removeEventListener("mousedown", closeStudentPickerOnBlur)
}

function closeStudentPicker(){
    studentSelectionPopup.style.display = "none"
}

/**
 * fetches a list of student names that start with the entered phrase and displays them to the user to select
 * @param inputValue
 */
function searchForStudentFromSelectInput(inputValue:string){
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
                selectionOption.addEventListener("click", ()=>{updateStudent(selectionOption)})
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

function updateStudent(clickedOption:HTMLElement){
    let affectedRent:Rent = findRentById(editingRentId)
    affectedRent.student_id = Number(clickedOption.getAttribute("student_id"))

    fetch(APPLICATION_URL + '/rent/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(affectedRent)
    })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            requestAllRents()
            closeStudentPicker()
        })
        .catch(error => console.error(error));
}

function updateNote(input:HTMLInputElement){
    editingRentId = Number(input.closest("tr").getAttribute("rent_id"))
    let affectedRent:Rent = findRentById(editingRentId)
    affectedRent.note = input.value

    fetch(APPLICATION_URL + '/rent/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(affectedRent)
    })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            requestAllRents()
            closeStudentPicker()
        })
        .catch(error => console.error(error));
}

function updateRentStart(input:HTMLInputElement){
    editingRentId = Number(input.closest("tr").getAttribute("rent_id"))
    let affectedRent:Rent = findRentById(editingRentId)
    console.log(input.value)
    affectedRent.rent_start = input.value

    fetch(APPLICATION_URL + '/rent/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(affectedRent)
    })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            requestAllRents()
            closeStudentPicker()
        })
        .catch(error => console.error(error));
}

//endregion

function createRent(){
    fetch(APPLICATION_URL + '/rent/createempty', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            requestAllRents()
            closeStudentPicker()
        })
        .catch(error => console.error(error));
}

//region utlity
function rentArrayToJson(array: any[]):Rent{
    let json:Rent = {
        rent_id: Number(array[0]),
        student_id: Number(array[1]),
        device_id: Number(array[2]),
        teacher_id: Number(array[3]),
        rent_start: array[4],
        rent_end_planned: array[5],
        rent_end_actual: array[6],
        note: array[7]
    }
    return json
}

function studentArrayToJson(array: any[]):Student {
    let json:Student = {
        student_id: array[0],
        firstname: array[1],
        lastname: array[2],
        school_class: array[3],
        password: array[4],
        user_id: array[5]
    }
    return json
}

function teacherArrayToJson(array: any[]):Teacher {
    let json:Teacher = {
        teacher_id: array[0],
        firstname: array[1],
        lastname: array[2],
        verification: array[3],
        password: array[4],
        user_id: array[5]
    }
    return json
}

function findRentById(id:number):Rent {
    let res = null
    allRents.forEach(rent => {
        if(rent.rent_id == id){
            res = rent;
        }
    })
    return res
}

function findStudentById(id:number):Student {
    let res = null
    allStudents.forEach(student => {
        if(student.student_id == id){
            res = student;
        }
    })
    return res
}

function findTeacherById(id:number):Teacher {
    let res = null
    allTeachers.forEach(teacher => {
        if(teacher.teacher_id == id){
            res = teacher;
        }
    })
    return res
}

//endregion