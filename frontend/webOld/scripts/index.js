var APPLICATION_URL = "http://localhost:8080/api";
var allRents = [];
var allStudents = [];
var allTeachers = [];
requestAllStudents();
function requestAllStudents() {
    allStudents = [];
    fetch(APPLICATION_URL + "/student/getall")
        .then(function (result) {
        return result.json();
    })
        .then(function (data) {
        allStudents = data;
        requestAllTeachers();
    })
        .catch(function (error) { return console.error(error); });
}
function requestAllTeachers() {
    allTeachers = [];
    fetch(APPLICATION_URL + "/teacher/getall")
        .then(function (result) {
        return result.json();
    })
        .then(function (data) {
        allTeachers = data;
        requestAllRents();
    })
        .catch(function (error) { return console.error(error); });
}
function requestAllRents() {
    allRents = [];
    fetch(APPLICATION_URL + "/rent/getall")
        .then(function (result) {
        return result.json();
    })
        .then(function (data) {
        allRents = data;
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
    var _a;
    var headingHtml = document.createElement("tr");
    columns.forEach(function (column) {
        var headRow = document.createElement("th");
        headRow.innerText = column.name;
        headingHtml.appendChild(headRow);
    });
    var table = document.querySelector('table');
    table.innerHTML = "";
    table.appendChild(headingHtml);
    console.log(allRents, allRents.length);
    var html = [];
    var _loop_1 = function (i) {
        var row = document.createElement("tr");
        row.setAttribute("rent_id", String((_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.rent_id));
        columns.forEach(function (column) {
            var _a, _b, _c, _d, _e;
            var cell = document.createElement("td");
            var cellinput = document.createElement("input");
            cellinput.type = column.inputType;
            cellinput.setAttribute("celltype", column.cellType);
            switch (column.inputType) {
                case "number":
                    cellinput.setAttribute("min", "0");
                    break;
            }
            switch (column.cellType) {
                case "student_id":
                    cellinput.addEventListener("mouseup", function () { var _a; openStudentPicker(cellinput, (_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.rent_id); });
                    cellinput.value = ((_b = (_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.student) === null || _b === void 0 ? void 0 : _b.firstname) || "";
                    break;
                case "teacherRent":
                case "teacherReturn":
                    cellinput.value = ((_d = (_c = allRents[i]) === null || _c === void 0 ? void 0 : _c.teacher) === null || _d === void 0 ? void 0 : _d.lastname) || "";
                    break;
                case "note":
                    cellinput.addEventListener("blur", function () { updateRent(cellinput, column.cellType, cellinput.value); });
                    cellinput.value = ((_e = allRents[i]) === null || _e === void 0 ? void 0 : _e.note) || "";
                    break;
                case "rent_start":
                case "rent_end_planned":
                case "rent_end_actual":
                    cellinput.addEventListener("input", function () { updateRent(cellinput, column.cellType, cellinput.value); });
                    cellinput.value = allRents[i][column.cellType] || "";
            }
            cell.appendChild(cellinput);
            row.appendChild(cell);
        });
        html.push(row);
    };
    for (var i = 0; i < Math.min(allRents.length, 20); i++) {
        _loop_1(i);
    }
    table.append.apply(table, html);
}
var studentSelectionPopup = document.querySelector("#studentSelectionPopup");
var studentSearchbar = document.querySelector('#studentSelectionPopup .search');
studentSearchbar.addEventListener("keyup", function () { searchForStudentFromSelectInput(studentSearchbar.value, Number(studentSearchbar.getAttribute('rent_id'))); });
function openStudentPicker(input, rentId) {
    searchForStudentFromSelectInput("", rentId);
    studentSelectionPopup.querySelector("input").value = "";
    studentSelectionPopup.querySelector("input").setAttribute("rent_id", String(rentId));
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
function searchForStudentFromSelectInput(inputValue, rentId) {
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
            selectionOption.innerText = student.firstname + " " + student.lastname;
            selectionOption.addEventListener("click", function () { updateRent(selectionOption, "student_id", student.student_id, rentId); });
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
function updateRent(input, key, value, rentId) {
    var _a, _b;
    if (rentId == undefined)
        rentId = Number(input.closest("tr").getAttribute("rent_id"));
    var rentOriginal = findRentById(rentId);
    var rentUpdate = {
        rent_id: rentId,
        student_id: (_a = rentOriginal.student) === null || _a === void 0 ? void 0 : _a.student_id,
        device_id: rentOriginal.device_id,
        teacher_id: (_b = rentOriginal.teacher) === null || _b === void 0 ? void 0 : _b.teacher_id,
        rent_start: rentOriginal.rent_start,
        rent_end_planned: rentOriginal.rent_end_planned,
        rent_end_actual: rentOriginal.rent_end_actual,
        note: rentOriginal.note
    };
    rentUpdate[key] = value;
    fetch(APPLICATION_URL + '/rent/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rentUpdate)
    })
        .then(function (response) { return response.text(); })
        .then(function (data) {
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
function findTeacherById(id) {
    var res = null;
    allTeachers.forEach(function (teacher) {
        if (teacher.teacher_id == id) {
            res = teacher;
        }
    });
    return res;
}
function convertDateFormat(inputDate) {
    var isAlreadyFormatted = /^\d{4}-\d{2}-\d{2}$/.test(inputDate);
    if (isAlreadyFormatted || inputDate == undefined) {
        return inputDate;
    }
    var dateParts = inputDate.split('.');
    var day = dateParts[0];
    var month = dateParts[1];
    var year = dateParts[2];
    var formattedDate = "".concat(year, "-").concat(month, "-").concat(day);
    return formattedDate;
}
//# sourceMappingURL=index.js.map