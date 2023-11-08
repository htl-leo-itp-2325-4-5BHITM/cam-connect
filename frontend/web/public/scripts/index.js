var APPLICATION_URL = "http://localhost:8080";
var columns = [
    { name: "Gerät Nr.", inputType: "number", cellType: "nr" },
    { name: "Zubehör", inputType: "text", cellType: "extras" },
    { name: "Entlehner*in + Klasse", inputType: "text", cellType: "student" },
    { name: "Entlehnung Datum", inputType: "date", cellType: "rentStart" },
    { name: "Unterschrift Entlehner*in", inputType: "checkbox", cellType: "sigRent" },
    { name: "Paraphe Lehkraft", inputType: "text", cellType: "teacherRent" },
    { name: "Rückgabe geplant", inputType: "date", cellType: "rentEndPlanned" },
    { name: "Rückgabe tatsächlich", inputType: "date", cellType: "rendEndActual" },
    { name: "Unterschrift Entlehner*in", inputType: "checkbox", cellType: "sigReturn" },
    { name: "Paraphe Lehkraft", inputType: "text", cellType: "teacherReturn" },
    { name: "Anmerkung", inputType: "text", cellType: "note" },
];
generateTable(20);
function generateTable(rowCount) {
    var headingHtml = document.createElement("tr");
    columns.forEach(function (column) {
        var headRow = document.createElement("th");
        headRow.innerText = column.name;
        headingHtml.appendChild(headRow);
    });
    var table = document.querySelector('table');
    table.appendChild(headingHtml);
    var html = [];
    var _loop_1 = function (i) {
        var rowHtml = document.createElement("tr");
        columns.forEach(function (column) {
            var cell = document.createElement("td");
            var cellinput = document.createElement("input");
            cellinput.type = column.inputType;
            cellinput.setAttribute("celltype", column.cellType);
            switch (column.inputType) {
                case "number":
                    cellinput.setAttribute("min", "0");
                    break;
            }
            if (column.cellType === "student") {
                cellinput.addEventListener("mouseup", function () { openStudentPicker(cellinput); });
            }
            cell.appendChild(cellinput);
            rowHtml.appendChild(cell);
        });
        html.push(rowHtml);
    };
    for (var i = 0; i < rowCount; i++) {
        _loop_1(i);
    }
    table.append.apply(table, html);
}
var studentSelectionPopup = document.querySelector("#studentSelectionPopup");
var studentSearchbar = document.querySelector('#studentSelectionPopup .search');
function openStudentPicker(input) {
    input.value = "";
    var bounds = input.getBoundingClientRect();
    studentSelectionPopup.style.top = bounds.top + "px";
    studentSelectionPopup.style.left = bounds.left + "px";
    studentSelectionPopup.style.display = "block";
    studentSearchbar.focus();
    setTimeout(function () { document.addEventListener("mousedown", closeStudentPicker); });
}
function closeStudentPicker(e) {
    if (e.target === studentSelectionPopup || e.target.closest('#studentSelectionPopup') === studentSelectionPopup || e.target.getAttribute("celltype") === "student")
        return;
    studentSelectionPopup.style.display = "none";
    document.removeEventListener("mousedown", closeStudentPicker);
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
//# sourceMappingURL=index.js.map