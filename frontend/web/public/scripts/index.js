if (true) {
    console.log("dei mum");
}
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
var headings = [
    "Gerät Nr.", "Zubehör", "Entlehner*in + Klasse", "Entlehnung Datum", "Unterschrift Entlehner*in", "Paraphe Lehkraft", "Rückgabe geplant",
    "Rückgabe tatsächlich", "Unterschrift Entlehner*in", "Paraphe Lehkraft", "Anmerkung"
];
generateTable(20);
function generateTable(rowCount) {
    var headingHtml = document.createElement("tr");
    var rowHtml = document.createElement("tr");
    headings.forEach(function (heading) {
        var headRow = document.createElement("th");
        headRow.innerText = heading;
        headingHtml.appendChild(headRow);
        var emptyRow = document.createElement("td");
        emptyRow.appendChild(document.createElement("input"));
        rowHtml.appendChild(emptyRow);
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
//# sourceMappingURL=index.js.map