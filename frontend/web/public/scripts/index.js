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
    .then(function (response) { return response.json(); })
    .then(function (data) { return console.log(data); })
    .catch(function (error) { return console.error(error); });
fetch("http://localhost:8080/equipment/getbyid/1/getname")
    .then(function (result) {
    console.log(result);
    return result.text();
})
    .then(function (data) {
    document.querySelector('p').innerText = data;
});
//# sourceMappingURL=index.js.map