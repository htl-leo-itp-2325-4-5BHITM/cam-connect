fetch('http://localhost:8080/equipment/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'Lumix S5ii' })
})
    .then(function (response) { return response.text(); })
    .then(function (data) { return console.log(data); })
    .catch(function (error) { return console.error(error); });
fetch("http://localhost:8080/equipment/getbyid/1/getname")
    .then(function (result) {
    console.log(result);
    return result.text();
})
    .then(function (data) {
    console.log(data);
});
var columns = [
    { name: "Gerät Nr.", inputType: "number" },
    { name: "Zubehör", inputType: "text" },
    { name: "Entlehner*in + Klasse", inputType: "text" },
    { name: "Entlehnung Datum", inputType: "date" },
    { name: "Unterschrift Entlehner*in", inputType: "checkbox" },
    { name: "Paraphe Lehkraft", inputType: "text" },
    { name: "Rückgabe geplant", inputType: "date" },
    { name: "Rückgabe tatsächlich", inputType: "date" },
    { name: "Unterschrift Entlehner*in", inputType: "checkbox" },
    { name: "Paraphe Lehkraft", inputType: "text" },
    { name: "Anmerkung", inputType: "text" },
];
generateTable(20);
function generateTable(rowCount) {
    var headingHtml = document.createElement("tr");
    var rowHtml = document.createElement("tr");
    columns.forEach(function (column) {
        var headRow = document.createElement("th");
        headRow.innerText = column.name;
        headingHtml.appendChild(headRow);
        var cell = document.createElement("td");
        var cellinput = document.createElement("input");
        cellinput.type = column.inputType;
        cell.appendChild(cellinput);
        switch (column.inputType) {
            case "number":
                cellinput.setAttribute("min", "0");
                break;
        }
        if (column.name === "Entlehner*in + Klasse") {
            cellinput.onclick = openStudentPicker;
        }
        rowHtml.appendChild(cell);
    });
    var table = document.querySelector('table');
    table.innerHTML = "";
    table.appendChild(headingHtml);
    var multiRowHtml = "";
    for (var i = 0; i < rowCount; i++) {
        multiRowHtml += "<tr>".concat(rowHtml.innerHTML, "</tr>");
    }
    table.innerHTML += multiRowHtml;
}
function openStudentPicker() {
}
//# sourceMappingURL=index.js.map