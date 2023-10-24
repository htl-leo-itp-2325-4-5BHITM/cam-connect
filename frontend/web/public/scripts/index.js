if (true) {
    console.log("dei sfdasdfasdf");
}
fetch("http://localhost:8080/equipment/list")
    .then(function (result) {
    console.log(result);
    return result.text();
})
    .then(function (data) {
    document.querySelector('p').innerText = data;
});
//# sourceMappingURL=index.js.map