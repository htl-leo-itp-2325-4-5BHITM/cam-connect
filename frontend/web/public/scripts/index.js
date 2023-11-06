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
            cellinput.setAttribute("cellType", column.cellType);
            switch (column.inputType) {
                case "number":
                    cellinput.setAttribute("min", "0");
                    break;
            }
            if (column.cellType === "student") {
                cellinput.addEventListener("focus", function () { openStudentPicker(cellinput); });
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
function openStudentPicker(input) {
    var bounds = input.getBoundingClientRect();
    studentSelectionPopup.style.top = bounds.top + bounds.height + "px";
    studentSelectionPopup.style.left = bounds.left + "px";
    studentSelectionPopup.style.display = "block";
    setTimeout(function () { document.addEventListener("click", closeStudentPicker); });
}
function closeStudentPicker(e) {
    if (e.target === studentSelectionPopup || e.target.getAttribute("cellType") === "student")
        return;
    studentSelectionPopup.style.display = "none";
    document.removeEventListener("click", closeStudentPicker);
}
//# sourceMappingURL=index.js.map