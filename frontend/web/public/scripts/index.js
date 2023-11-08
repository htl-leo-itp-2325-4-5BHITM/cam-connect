var APPLICATION_URL = "http://localhost:8080";
var allRents = [];
var allStudents = [];
var allTeachers = [];
var editingRentId = -1;
requestAllStudents();
function requestAllStudents() {
    allStudents = [];
    fetch(APPLICATION_URL + "/student/getall")
        .then(function (result) {
        console.log(result);
        return result.json();
    })
        .then(function (data) {
        console.log(data);
        var html = [];
        data.forEach(function (student) {
            allStudents.push(studentArrayToJson(student));
        });
        requestAllTeachers();
    })
        .catch(function (error) { return console.error(error); });
}
function requestAllTeachers() {
    allStudents = [];
    fetch(APPLICATION_URL + "/teacher/getall")
        .then(function (result) {
        console.log(result);
        return result.json();
    })
        .then(function (data) {
        console.log(data);
        var html = [];
        data.forEach(function (teacher) {
            allTeachers.push(teacherArrayToJson(teacher));
        });
        requestAllRents();
    })
        .catch(function (error) { return console.error(error); });
}
function requestAllRents() {
    allRents = [];
    fetch(APPLICATION_URL + "/rent/getall")
        .then(function (result) {
        console.log(result);
        return result.json();
    })
        .then(function (data) {
        console.log(data);
        var html = [];
        data.forEach(function (rent) {
            allRents.push(rentArrayToJson(rent));
        });
        generateTable();
    })
        .catch(function (error) { return console.error(error); });
}
var columns = [
    { name: "Gerät Nr.", inputType: "number", cellType: "nr" },
    { name: "Zubehör", inputType: "text", cellType: "extras" },
    { name: "Entlehner*in + Klasse", inputType: "text", cellType: "student_id" },
    { name: "Entlehnung Datum", inputType: "date", cellType: "rent_start" },
    { name: "Unterschrift Entlehner*in", inputType: "checkbox", cellType: "sigRent" },
    { name: "Paraphe Lehkraft", inputType: "text", cellType: "teacherRent" },
    { name: "Rückgabe geplant", inputType: "date", cellType: "rent_end_planned" },
    { name: "Rückgabe tatsächlich", inputType: "date", cellType: "rent_end_actual" },
    { name: "Unterschrift Entlehner*in", inputType: "checkbox", cellType: "sigReturn" },
    { name: "Paraphe Lehkraft", inputType: "text", cellType: "teacherReturn" },
    { name: "Anmerkung", inputType: "text", cellType: "note" },
];
function generateTable() {
    var _a, _b;
    var headingHtml = document.createElement("tr");
    columns.forEach(function (column) {
        var headRow = document.createElement("th");
        headRow.innerText = column.name;
        headingHtml.appendChild(headRow);
    });
    var table = document.querySelector('table');
    table.innerHTML = "";
    table.appendChild(headingHtml);
    var html = [];
    var _loop_1 = function (i) {
        var row = document.createElement("tr");
        console.log(String((_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.rent_id));
        row.setAttribute("rent_id", String((_b = allRents[i]) === null || _b === void 0 ? void 0 : _b.rent_id));
        columns.forEach(function (column) {
            var _a, _b;
            var cell = document.createElement("td");
            var cellinput = document.createElement("input");
            cellinput.type = column.inputType;
            cellinput.setAttribute("celltype", column.cellType);
            switch (column.inputType) {
                case "number":
                    cellinput.setAttribute("min", "0");
                    break;
            }
            if (column.cellType === "student_id") {
                cellinput.addEventListener("mouseup", function () { openStudentPicker(cellinput); });
                cellinput.value = (_b = findStudentById((_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.student_id)) === null || _b === void 0 ? void 0 : _b.firstname;
            }
            cell.appendChild(cellinput);
            row.appendChild(cell);
        });
        html.push(row);
    };
    for (var i = 0; i < Math.min(allRents.length, 21); i++) {
        _loop_1(i);
    }
    table.append.apply(table, html);
}
var studentSelectionPopup = document.querySelector("#studentSelectionPopup");
var studentSearchbar = document.querySelector('#studentSelectionPopup .search');
function openStudentPicker(input) {
    editingRentId = Number(input.closest("tr").getAttribute("rent_id"));
    searchForStudentFromSelectInput("");
    studentSelectionPopup.querySelector("input").value = "";
    var bounds = input.getBoundingClientRect();
    studentSelectionPopup.style.top = bounds.top + "px";
    studentSelectionPopup.style.left = bounds.left + "px";
    studentSelectionPopup.style.display = "block";
    studentSearchbar.focus();
    setTimeout(function () { document.addEventListener("mousedown", closeStudentPickerOnBlur); });
}
function closeStudentPickerOnBlur(e) {
    if (e.target === studentSelectionPopup || e.target.closest('#studentSelectionPopup') === studentSelectionPopup || e.target.getAttribute("celltype") === "student")
        return;
    closeStudentPicker();
    document.removeEventListener("mousedown", closeStudentPickerOnBlur);
}
function closeStudentPicker() {
    studentSelectionPopup.style.display = "none";
}
function searchForStudentFromSelectInput(inputValue) {
    fetch(APPLICATION_URL + '/student/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstname: inputValue })
    })
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var _a;
        var html = [];
        data.forEach(function (student) {
            var selectionOption = document.createElement('p');
            selectionOption.innerText = student[1] + " " + student[2];
            selectionOption.setAttribute("student_id", student[0]);
            selectionOption.addEventListener("click", function () { setStudent(selectionOption); });
            html.push(selectionOption);
        });
        if (html.length === 0) {
            var noResults = document.createElement('p');
            noResults.classList.add("noResults");
            noResults.innerText = "Keine Ergebnisse";
            html.push(noResults);
        }
        (_a = studentSelectionPopup.querySelector(".studentList")).replaceChildren.apply(_a, html);
    })
        .catch(function (error) { return console.error(error); });
}
function setStudent(clickedOption) {
    var affectedRent = findRentById(editingRentId);
    affectedRent.student_id = Number(clickedOption.getAttribute("student_id"));
    console.log(affectedRent);
    fetch(APPLICATION_URL + '/rent/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(affectedRent)
    })
        .then(function (response) { return response.text(); })
        .then(function (data) {
        console.log(data);
        requestAllRents();
        closeStudentPicker();
    })
        .catch(function (error) { return console.error(error); });
}
function createRent() {
    fetch(APPLICATION_URL + '/rent/createempty', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
        .then(function (response) { return response.text(); })
        .then(function (data) {
        console.log(data);
        requestAllRents();
        closeStudentPicker();
    })
        .catch(function (error) { return console.error(error); });
}
function rentArrayToJson(array) {
    var json = {
        rent_id: Number(array[0]),
        student_id: Number(array[1]),
        device_id: Number(array[2]),
        teacher_id: Number(array[3]),
        rent_start: array[4],
        rent_end_planned: array[5],
        rent_end_actual: array[6]
    };
    return json;
}
function studentArrayToJson(array) {
    var json = {
        student_id: array[0],
        firstname: array[1],
        lastname: array[2],
        school_class: array[3],
        password: array[4],
        user_id: array[5]
    };
    return json;
}
function teacherArrayToJson(array) {
    var json = {
        teacher_id: array[0],
        firstname: array[1],
        lastname: array[2],
        verification: array[3],
        password: array[4],
        user_id: array[5]
    };
    return json;
}
function findRentById(id) {
    var res = null;
    allRents.forEach(function (rent) {
        if (rent.rent_id == id) {
            res = rent;
        }
    });
    return res;
}
function findStudentById(id) {
    var res = null;
    allStudents.forEach(function (student) {
        if (student.student_id == id) {
            res = student;
        }
    });
    return res;
}
//# sourceMappingURL=index.js.map