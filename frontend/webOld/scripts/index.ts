const APPLICATION_URL: string = "http://localhost:8080/api"

let allRents: RentComplete[] = []
let allStudents: Student[] = []
let allTeachers: Teacher[] = []

//region base requests
requestAllStudents();

function requestAllStudents() {
    allStudents = []
    fetch(APPLICATION_URL + "/student/getall")
        .then(result => {
            return result.json()
        })
        .then((data) => {
            allStudents = data

            //TODO do this with promises
            requestAllTeachers()
        })
        .catch(error => console.error(error))
}

function requestAllTeachers() {
    allTeachers = []
    fetch(APPLICATION_URL + "/teacher/getall")
        .then(result => {
            return result.json()
        })
        .then(data => {
            allTeachers = data

            requestAllRents()
        })
        .catch(error => console.error(error))
}

function requestAllRents() {
    allRents = []
    fetch(APPLICATION_URL + "/rent/getall")
        .then(result => {
            return result.json()
        })
        .then(data => {
            allRents = data

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

interface RentComplete {
    rent_id: number,
    student: Student,
    device_id: number,
    teacher_start: Teacher,
    teacher_end: Teacher,
    rent_start: string,
    rent_end_planned: string,
    rent_end_actual: string,
    note: string,
    accessory: string,
    device_string: string
}

interface RentSimple {
    rent_id: number,
    student_id: number,
    device_id: number,
    teacher_start_id: number,
    teacher_end_id: number,
    rent_start: string,
    rent_end_planned: string,
    rent_end_actual: string,
    note: string,
    accessory: string,
    device_string: string
}

//region generate table
interface column {
    name: string,
    inputType: string,
    cellType: string
}

const columns: column[] = [
    {name: "Gerät Nr.", inputType: "text", cellType: "device_string"},
    {name: "Zubehör", inputType: "text", cellType: "accessory"},
    {name: "Entlehner*in + Klasse", inputType: "text", cellType: "student_id"},
    {name: "Entlehnung Datum", inputType: "date", cellType: "rent_start"},
    {name: "Unterschrift Entlehner*in", inputType: "none", cellType: ""},
    {name: "Paraphe Lehkraft", inputType: "text", cellType: "teacher_start"},
    {name: "Rückgabe geplant", inputType: "date", cellType: "rent_end_planned"},
    {name: "Rückgabe tatsächlich", inputType: "date", cellType: "rent_end_actual"},
    {name: "Unterschrift Entlehner*in", inputType: "none", cellType: ""},
    {name: "Paraphe Lehkraft", inputType: "text", cellType: "teacher_end"},
    {name: "Anmerkung", inputType: "text", cellType: "note"},
]

/**
 * Renders the Table to the html based on the data in the allRents array of Rent JSONs
 */
function generateTable() {
    //Create the Heading Row based purely on the data in the columns constant
    let headingHtml = document.createElement("tr")

    columns.forEach(column => {
        let headRow = document.createElement("th")
        headRow.innerText = column.name
        headingHtml.appendChild(headRow)
    })

    let table = document.querySelector('table')
    table.innerHTML = ""
    table.appendChild(headingHtml)

    console.log(allRents, allRents.length)
    //creates the main content
    let html: Element[] = []
    for (let i = 0; i < Math.min(allRents.length, 20); i++) { //run over either all the entries in allRents or 20 (max that fits on the page)
        let row = document.createElement("tr")
        row.setAttribute("rent_id", String(allRents[i]?.rent_id))

        //loops over all the columns and creates a cell for each
        columns.forEach(column => {
            let cell = document.createElement("td")

            if (column.inputType !== "none") {
                let cellinput = document.createElement("input")
                cellinput.type = column.inputType
                cellinput.setAttribute("celltype", column.cellType) //what piece of data the cell displays (rent_start, student_id etc.)

                //registers eventlisteners and displays data from allRents for columns that are synced with the db
                switch (column.cellType) {
                    case "student_id":
                        cellinput.addEventListener("mouseup", () => {
                            openStudentPicker(cellinput, allRents[i]?.rent_id)
                        })
                        cellinput.value = allRents[i]?.student?.firstname || ""
                        break
                    case "teacher_start":
                    case "teacher_end":
                        cellinput.addEventListener("mouseup", () => {
                            openTeacherPicker(cellinput, allRents[i]?.rent_id, column.cellType + "_id")
                        })
                        cellinput.value = allRents[i][column.cellType]?.lastname || ""
                        break
                    case "note":
                    case "accessory":
                    case "device_string":
                        cellinput.addEventListener("blur", () => {
                            updateRent(cellinput, column.cellType, cellinput.value)
                        })
                        cellinput.value = allRents[i][column.cellType] || ""
                        break
                    case "rent_start":
                    case "rent_end_planned":
                    case "rent_end_actual":
                        cellinput.addEventListener("input", () => {
                            updateRent(cellinput, column.cellType, cellinput.value)
                        })
                        cellinput.value = allRents[i][column.cellType] || ""
                        break
                }

                cell.appendChild(cellinput)
            }

            row.appendChild(cell)
        })

        html.push(row)
    }

    table.append(...html)
}

//endregion

//region student search and selection
const studentSelectionPopup: HTMLElement = document.querySelector("#studentSelectionPopup")
const studentSearchbar: HTMLInputElement = document.querySelector('#studentSelectionPopup .search')

studentSearchbar.addEventListener("keyup", () => {
    searchForStudentFromSelectInput(studentSearchbar.value, Number(studentSearchbar.getAttribute('rent_id')))
})

function openStudentPicker(input: HTMLInputElement, rentId: number) {
    //resets the popup
    searchForStudentFromSelectInput("", rentId)
    studentSelectionPopup.querySelector("input").value = ""
    studentSelectionPopup.querySelector("input").setAttribute("rent_id", String(rentId))

    let bounds = input.getBoundingClientRect()
    studentSelectionPopup.style.top = bounds.top + "px"
    studentSelectionPopup.style.left = bounds.left + "px"

    studentSelectionPopup.style.display = "block"
    studentSearchbar.focus()

    setTimeout(function () {
        document.addEventListener("mousedown", closeStudentPickerOnBlur)
    },)
}

function closeStudentPickerOnBlur(e: MouseEvent) {
    // check if what was clicked is the popup and exit
    // @ts-ignore cause the target object does not have the closest function in typescript smh
    if (e.target === studentSelectionPopup || e.target.closest('#studentSelectionPopup') === studentSelectionPopup || e.target.getAttribute("celltype") === "student") return

    closeStudentPicker()
    document.removeEventListener("mousedown", closeStudentPickerOnBlur)
}

function closeStudentPicker() {
    studentSelectionPopup.style.display = "none"
}


/**
 * fetches a list of student names that start with the entered phrase and displays them to the user to select
 * @param inputValue
 * @param rentId
 */
function searchForStudentFromSelectInput(inputValue: string, rentId?: number) {
    fetch(APPLICATION_URL + '/student/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({firstname: inputValue})
    })
        .then(response => response.json())
        .then(data => {
            let html: HTMLElement[] = []

            data.forEach((student: Student) => {
                let selectionOption = document.createElement('p');
                selectionOption.innerText = student.firstname + " " + student.lastname
                selectionOption.addEventListener("click", () => {
                    updateRent(selectionOption, "student_id", student.student_id, rentId)
                })
                html.push(selectionOption)
            })
            if (html.length === 0) {
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

//region search for teacher

var teacherSelectionPopup = document.querySelector("#teacherSelectionPopup") as HTMLInputElement;
var teacherSearchbar = document.querySelector('#teacherSelectionPopup .search') as HTMLInputElement;
teacherSearchbar.addEventListener("keyup", function () {
    searchForTeacherFromSelectInput(teacherSearchbar.value, Number(teacherSearchbar.getAttribute('rent_id')));
});

function openTeacherPicker(input: HTMLInputElement, rentId: number, teacherType: string) {
    searchForTeacherFromSelectInput("", rentId);
    teacherSelectionPopup.querySelector("input").value = "";
    teacherSelectionPopup.querySelector("input").setAttribute("rent_id", String(rentId));
    teacherSelectionPopup.querySelector("input").setAttribute("teacher_type", teacherType);
    var bounds = input.getBoundingClientRect();
    teacherSelectionPopup.style.top = bounds.top + "px";
    teacherSelectionPopup.style.left = bounds.left + "px";
    teacherSelectionPopup.style.display = "block";
    teacherSearchbar.focus();
    setTimeout(function () {
        document.addEventListener("mousedown", closeTeacherPickerOnBlur);
    });
}

function closeTeacherPickerOnBlur(e: MouseEvent) {
    //@ts-ignore
    if (e.target === teacherSelectionPopup || e.target.closest('#teacherSelectionPopup') === teacherSelectionPopup || e.target.getAttribute("celltype") === "teacher_start" || e.target.getAttribute("celltype") === "teacher_end")
        return;
    closeTeacherPicker();
    document.removeEventListener("mousedown", closeTeacherPickerOnBlur);
}

function closeTeacherPicker() {
    teacherSelectionPopup.style.display = "none";
}

function searchForTeacherFromSelectInput(inputValue: string, rentId: number) {
    fetch(APPLICATION_URL + '/teacher/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({lastname: inputValue})
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let teacherType = teacherSearchbar.getAttribute('teacher_type')
            console.log(data)
            var html = [];
            data.forEach(function (teacher: Teacher) {
                var selectionOption = document.createElement('p');
                selectionOption.innerText = teacher.firstname + " " + teacher.lastname;
                selectionOption.addEventListener("click", function () {
                    updateRent(selectionOption, teacherType, teacher.teacher_id, rentId);
                });
                html.push(selectionOption);
            });
            if (html.length === 0) {
                var noResults = document.createElement('p');
                noResults.classList.add("noResults");
                noResults.innerText = "Keine Ergebnisse";
                html.push(noResults);
            }
            teacherSelectionPopup.querySelector(".teacherList").replaceChildren(...html)
        })
        .catch(error => console.error(error));
}

//endregion


function updateRent(input: HTMLElement, key: string, value: any, rentId?: number) {
    if (rentId == undefined) rentId = Number(input.closest("tr").getAttribute("rent_id"))
    console.log(rentId)
    let rentOriginal: RentComplete = findRentById(rentId)
    let rentUpdate: RentSimple = {
        device_string: rentOriginal.device_string,
        rent_id: rentId,
        student_id: rentOriginal.student?.student_id,
        device_id: rentOriginal.device_id,
        teacher_start_id: rentOriginal.teacher_start?.teacher_id,
        teacher_end_id: rentOriginal.teacher_end?.teacher_id,
        rent_start: rentOriginal.rent_start,
        rent_end_planned: rentOriginal.rent_end_planned,
        rent_end_actual: rentOriginal.rent_end_actual,
        note: rentOriginal.note,
        accessory: rentOriginal.accessory
    }
    // @ts-ignore
    rentUpdate[key] = value

    console.log(rentUpdate)

    fetch(APPLICATION_URL + '/rent/getbyid/' + rentId + '/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rentUpdate)
    })
        .then(response => response.text())
        .then(data => {
            requestAllRents()
            closeStudentPicker()
            closeTeacherPicker()
        })
        .catch(error => console.error(error));
}

function createRent() {
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
function findRentById(id: number): RentComplete {
    let res = null
    allRents.forEach(rent => {
        if (rent.rent_id == id) {
            res = rent;
        }
    })
    return res
}

//endregion

//region load csv update

function importStudents(file: File): Promise<boolean> {
    console.log("importing")
    const formData = new FormData();
    formData.append('file', file)

    return fetch(`http://localhost:8080/api/student/import`, {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
            return true
        })
        .catch(error => {
            console.error(error)
            return false
        })
}

// Example usage:
const fileInput = document.getElementById('csvFileInput') as HTMLInputElement
const importButton = document.querySelector('#importButton') as HTMLButtonElement

importButton.addEventListener('click', (event) => {
    const files = fileInput.files;

    if (files && files.length > 0) {
        const file = files[0]
        console.log(file)
        importStudents(file)
            .then(success => {
                if (success) {
                    console.log('Students imported successfully!')
                    // Optionally, perform any actions after successful import
                } else {
                    console.error('Failed to import students.')
                    // Optionally, handle the failure scenario
                }
            });
    }
});
//endregion