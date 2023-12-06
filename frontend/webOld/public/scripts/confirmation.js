var APPLICATION_URL = "http://localhost:8080/api";
PopupEngine.init({ textColor: "black", backgroundColor: "white", elemBackground: "#EEE" });
function confirmRent(verificationStatus) {
    var urlParams = new URLSearchParams(window.location.search);
    var rentId = urlParams.get("id");
    var code = urlParams.get("vcode");
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