var APPLICATION_URL = "http://localhost:8080/api";
PopupEngine.init({ textColor: "black", backgroundColor: "white", elemBackground: "#EEE" });
var urlParams = new URLSearchParams(window.location.search);
var rentId = urlParams.get("id");
var code = urlParams.get("vcode");
if (urlParams.get("isAccepted")) {
    document.querySelector(".accepted").setAttribute("active", "true");
    confirmRent("confirmed");
}
else {
    document.querySelector(".verification").setAttribute("active", "true");
}
fetch(APPLICATION_URL + "/rent/getbyid/".concat(rentId))
    .then(function (result) {
    return result.json();
})
    .then(function (data) {
    console.log(data);
    document.querySelector('.rentData').innerHTML = "\n            <p>".concat(data.student.firstname, " ").concat(data.student.lastname, "</p>\n            <p>Ger\u00E4t Nr: ").concat(data.device_string, ", mit Zubeh\u00F6r: ").concat(data.accessory || "keinem", "</p>\n            <p>von: ").concat(data.rent_start, ", bis (geplant): ").concat(data.rent_end_planned || "unbekannt", "</p>\n        ");
})
    .catch(function (error) { return console.error(error); });
function confirmRent(verificationStatus) {
    var verificationMessage = document.querySelector("#rejectionReason").value;
    fetch(APPLICATION_URL + "/rent/getbyid/".concat(rentId, "/confirm"), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "verification_code": code || "",
            "verification_status": verificationStatus || "",
            "verification_message": verificationMessage || ""
        })
    })
        .then(function (response) { return response.json(); })
        .then(function (data) {
        console.log(data);
        switch (data.ccStatus.statusCode) {
            case 1000:
                if (verificationStatus == "confirmed") {
                    PopupEngine.createModal({ text: "Verleihung wurde erfolgreich best\u00E4tigt. Sie k\u00F6nnen diese Seite nun schlie\u00DFen." });
                }
                else if (verificationStatus == "declined") {
                    PopupEngine.createModal({ text: "Verleihung wurde erfolgreich abgelehnt. Sie k\u00F6nnen diese Seite nun schlie\u00DFen." });
                }
                break;
            case 1205:
                PopupEngine.createModal({ text: "Die Verleihung wurde bereits best\u00E4tigt oder abgelehnt" });
                break;
        }
    })
        .catch(function (error) { return console.error(error); });
}
//# sourceMappingURL=confirmation.js.map