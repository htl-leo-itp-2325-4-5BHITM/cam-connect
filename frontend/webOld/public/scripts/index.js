var APPLICATION_URL = "http://localhost:8080/api";
var allRents = [];
var allStudents = [];
var allTeachers = [];
requestAllStudents();
PopupEngine.init({ textColor: "black", backgroundColor: "white", elemBackground: "#EEE" });
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
    { name: "Gerät Nr.", inputType: "text", cellType: "device_string" },
    { name: "Zubehör", inputType: "text", cellType: "accessory" },
    { name: "Entlehner*in + Klasse", inputType: "text", cellType: "student_id" },
    { name: "Entlehnung Datum", inputType: "date", cellType: "rent_start" },
    { name: "Paraphe Lehkraft", inputType: "text", cellType: "teacher_start" },
    { name: "Rückgabe geplant", inputType: "date", cellType: "rent_end_planned" },
    { name: "Rückgabe tatsächlich", inputType: "date", cellType: "rent_end_actual" },
    { name: "Paraphe Lehkraft", inputType: "text", cellType: "teacher_end" },
    { name: "Anmerkung", inputType: "text", cellType: "note" },
    { name: "VStatus", inputType: "none", cellType: "verification_status" },
    { name: "DeleteRow", inputType: "text", cellType: "delete_row" }
];
var statusResolved = {
    "WAITING": "wartend",
    "DECLINED": "abgelehnt",
    "CONFIRMED": "bestätigt",
    "CREATED": "erstellt",
    "RETURNED": "zurückgegeben"
};
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
    var html = [];
    var _loop_1 = function (i) {
        var row = document.createElement("tr");
        row.setAttribute("rent_id", String((_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.rent_id));
        columns.forEach(function (column) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var cell = document.createElement("td");
            if (column.inputType !== "none") {
                var cellinput_1 = document.createElement("input");
                cellinput_1.type = column.inputType;
                cellinput_1.setAttribute("celltype", column.cellType);
                switch (column.cellType) {
                    case "student_id":
                        cellinput_1.addEventListener("mouseup", function () {
                            var _a;
                            openStudentPicker(cellinput_1, (_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.rent_id);
                        });
                        cellinput_1.value = ((_b = (_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.student) === null || _b === void 0 ? void 0 : _b.firstname) || "";
                        break;
                    case "teacher_start":
                    case "teacher_end":
                        cellinput_1.addEventListener("mouseup", function () {
                            var _a;
                            openTeacherPicker(cellinput_1, (_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.rent_id, column.cellType + "_id");
                        });
                        cellinput_1.value = ((_c = allRents[i][column.cellType]) === null || _c === void 0 ? void 0 : _c.lastname) || "";
                        break;
                    case "note":
                    case "accessory":
                    case "device_string":
                        cellinput_1.addEventListener("blur", function () {
                            updateRent(cellinput_1, column.cellType, cellinput_1.value);
                        });
                        cellinput_1.value = allRents[i][column.cellType] || "";
                        break;
                    case "rent_start":
                    case "rent_end_planned":
                    case "rent_end_actual":
                        cellinput_1.addEventListener("input", function () {
                            updateRent(cellinput_1, column.cellType, cellinput_1.value);
                        });
                        cellinput_1.value = allRents[i][column.cellType] || "";
                        break;
                    case "delete_row":
                        var button = document.createElement('button');
                        switch ((_d = allRents[i]) === null || _d === void 0 ? void 0 : _d.status) {
                            case null:
                            case undefined:
                            case "CREATED":
                            case "DECLINED":
                            case "RETURNED":
                                button.innerHTML = "Löschen";
                                button.addEventListener("click", function () {
                                    var _a;
                                    removeRow((_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.rent_id);
                                });
                                break;
                            case "WAITING":
                                button.disabled = true;
                                button.innerHTML = "Löschen";
                                break;
                            case "CONFIRMED":
                                button.innerHTML = "Zurückgeben";
                                button.addEventListener("click", function () {
                                    var _a, _b;
                                    returnRent((_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.rent_id, (_b = allRents[i]) === null || _b === void 0 ? void 0 : _b.verification_code);
                                });
                                break;
                        }
                        cell.appendChild(button);
                        break;
                }
                if (column.cellType != "delete_row") {
                    cell.appendChild(cellinput_1);
                }
            }
            if (column.cellType == "verification_status") {
                switch ((_e = allRents[i]) === null || _e === void 0 ? void 0 : _e.status) {
                    case null:
                    case undefined:
                    case "CREATED":
                        var cellButton = document.createElement("button");
                        cellButton.classList.add("verification_button");
                        cellButton.innerHTML = "Bestätigung Anfragen";
                        cellButton.addEventListener("click", function () {
                            var _a;
                            sendVerificationRequest((_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.rent_id);
                        });
                        cell.appendChild(cellButton);
                        break;
                    default:
                        var cellChip = document.createElement('div');
                        cellChip.classList.add("verification_chip");
                        cellChip.setAttribute("status", (_f = allRents[i]) === null || _f === void 0 ? void 0 : _f.status);
                        cellChip.innerHTML = statusResolved[(_g = allRents[i]) === null || _g === void 0 ? void 0 : _g.status];
                        if (((_h = allRents[i]) === null || _h === void 0 ? void 0 : _h.status) == "DECLINED") {
                            cellChip.setAttribute("data-popup-heading", "Ablehnungsnachricht");
                            cellChip.setAttribute("data-popup-text", "Anfrage nochmal senden");
                            cellChip.addEventListener("click", function () {
                                var _a;
                                PopupEngine.createModal({
                                    heading: "Ablehnungsnachricht",
                                    text: (_a = allRents[i]) === null || _a === void 0 ? void 0 : _a.verification_message,
                                    buttons: [
                                        {
                                            text: "Anfrage nochmal senden",
                                            action: function () {
                                                sendVerificationRequest(allRents[i].rent_id);
                                            },
                                            closePopup: true
                                        },
                                        {
                                            text: "Abbrechen"
                                        }
                                    ]
                                });
                            });
                        }
                        cell.appendChild(cellChip);
                        break;
                }
            }
            row.appendChild(cell);
        });
        html.push(row);
    };
    for (var i = 0; i < Math.min(allRents.length, 20); i++) {
        _loop_1(i);
    }
    table.append.apply(table, html);
}
function returnRent(rentId, code) {
    fetch(APPLICATION_URL + "/rent/getbyid/".concat(rentId, "/return"), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "verification_code": code || "",
            "verification_status": "RETURNED",
            "verification_message": " "
        })
    })
        .then(function (response) { return response.json(); })
        .then(function (data) {
        console.log(data);
        requestAllRents();
    })
        .catch(function (error) { return console.error(error); });
}
function removeRow(rentId) {
    fetch(APPLICATION_URL + "/rent/getbyid/".concat(rentId, "/remove"))
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        console.log(data);
        requestAllRents();
    })
        .catch(function (error) { return console.error(error); });
}
function sendVerificationRequest(rentId) {
    console.log(rentId);
    fetch(APPLICATION_URL + "/rent/getbyid/".concat(rentId, "/sendconfirmation"))
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        console.log(data);
        requestAllRents();
    })
        .catch(function (error) { return console.error(error); });
}
var studentSelectionPopup = document.querySelector("#studentSelectionPopup");
var studentSearchbar = document.querySelector('#studentSelectionPopup .search');
studentSearchbar.addEventListener("keyup", function () {
    searchForStudentFromSelectInput(studentSearchbar.value, Number(studentSearchbar.getAttribute('rent_id')));
});
function openStudentPicker(input, rentId) {
    searchForStudentFromSelectInput("", rentId);
    studentSelectionPopup.querySelector("input").value = "";
    studentSelectionPopup.querySelector("input").setAttribute("rent_id", String(rentId));
    var bounds = input.getBoundingClientRect();
    studentSelectionPopup.style.top = bounds.top + "px";
    studentSelectionPopup.style.left = bounds.left + "px";
    studentSelectionPopup.style.display = "block";
    studentSearchbar.focus();
    setTimeout(function () {
        document.addEventListener("mousedown", closeStudentPickerOnBlur);
    });
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
            selectionOption.addEventListener("click", function () {
                updateRent(selectionOption, "student_id", student.student_id, rentId);
            });
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
var teacherSelectionPopup = document.querySelector("#teacherSelectionPopup");
var teacherSearchbar = document.querySelector('#teacherSelectionPopup .search');
teacherSearchbar.addEventListener("keyup", function () {
    searchForTeacherFromSelectInput(teacherSearchbar.value, Number(teacherSearchbar.getAttribute('rent_id')));
});
function openTeacherPicker(input, rentId, teacherType) {
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
function closeTeacherPickerOnBlur(e) {
    if (e.target === teacherSelectionPopup || e.target.closest('#teacherSelectionPopup') === teacherSelectionPopup || e.target.getAttribute("celltype") === "teacher_start" || e.target.getAttribute("celltype") === "teacher_end")
        return;
    closeTeacherPicker();
    document.removeEventListener("mousedown", closeTeacherPickerOnBlur);
}
function closeTeacherPicker() {
    teacherSelectionPopup.style.display = "none";
}
function searchForTeacherFromSelectInput(inputValue, rentId) {
    fetch(APPLICATION_URL + '/teacher/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lastname: inputValue })
    })
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        var _a;
        var teacherType = teacherSearchbar.getAttribute('teacher_type');
        console.log(data);
        var html = [];
        data.forEach(function (teacher) {
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
        (_a = teacherSelectionPopup.querySelector(".teacherList")).replaceChildren.apply(_a, html);
    })
        .catch(function (error) { return console.error(error); });
}
function updateRent(input, key, value, rentId) {
    var _a, _b, _c;
    if (rentId == undefined)
        rentId = Number(input.closest("tr").getAttribute("rent_id"));
    console.log(rentId);
    var rentOriginal = findRentById(rentId);
    var rentUpdate = {
        device_string: rentOriginal.device_string,
        rent_id: rentId,
        student_id: (_a = rentOriginal.student) === null || _a === void 0 ? void 0 : _a.student_id,
        device_id: rentOriginal.device_id,
        teacher_start_id: (_b = rentOriginal.teacher_start) === null || _b === void 0 ? void 0 : _b.teacher_id,
        teacher_end_id: (_c = rentOriginal.teacher_end) === null || _c === void 0 ? void 0 : _c.teacher_id,
        rent_start: rentOriginal.rent_start,
        rent_end_planned: rentOriginal.rent_end_planned,
        rent_end_actual: rentOriginal.rent_end_actual,
        verification_code: rentOriginal.verification_code,
        status: rentOriginal.status,
        verification_message: rentOriginal.verification_message,
        note: rentOriginal.note,
        accessory: rentOriginal.accessory
    };
    rentUpdate[key] = value;
    console.log(rentUpdate);
    fetch(APPLICATION_URL + '/rent/getbyid/' + rentId + '/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rentUpdate)
    })
        .then(function (response) { return response.json(); })
        .then(function (data) {
        console.log(data);
        requestAllRents();
        closeStudentPicker();
        closeTeacherPicker();
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
function deleteRow(rentId) {
    var confirmation = confirm("Are you sure you want to delete this row?");
    if (confirmation) {
        fetch(APPLICATION_URL + "/rent/getbyid/".concat(rentId, "/delete"), {
            method: 'DELETE',
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            console.log(data);
            requestAllRents();
        })
            .catch(function (error) { return console.error(error); });
    }
}
function importDataFromCsv(button) {
    var file = button.closest("div").querySelector("input").files[0];
    var formData = new FormData();
    formData.append('file', file);
    console.log(formData, file);
    var importType = button.closest("div").getAttribute("data-import");
    fetch(APPLICATION_URL + "/".concat(importType, "/import"), {
        method: 'POST',
        body: formData,
    })
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        console.log(data);
        switch (data.ccStatus.statusCode) {
            case 1000:
                PopupEngine.createNotification({ text: "Successfully imported ".concat(importType) });
                break;
            case 1204:
                PopupEngine.createNotification({ text: "Konnte nicht importieren weil die filestruktur invalide ist" });
                break;
        }
        requestAllStudents();
    })
        .catch(function (error) {
        console.error(error);
    });
}
var importButtonss = document.querySelectorAll('#import button');
importButtonss.forEach(function (elem) {
    elem.addEventListener("click", function () { importDataFromCsv(elem); });
});
function findRentById(id) {
    var res = null;
    allRents.forEach(function (rent) {
        if (rent.rent_id == id) {
            res = rent;
        }
    });
    return res;
}
//# sourceMappingURL=index.js.map