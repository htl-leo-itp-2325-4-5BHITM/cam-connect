var APPLICATION_URL = "http://localhost:8080/api";
// @ts-ignore
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
                    //@ts-ignore
                    PopupEngine.createModal({ text: "Verleihung wurde erfolgreich best\u00E4tigt" });
                }
                else if (verificationStatus == "declined") {
                    //@ts-ignore
                    PopupEngine.createModal({ text: "Verleihung wurde erfolgreich abgelehnt" });
                }
                break;
            case 1205:
                //@ts-ignore
                PopupEngine.createModal({ text: "Die Verleihung wurde bereits best\u00E4tigt oder abgelehnt" });
                break;
        }
    })
        .catch(function (error) { return console.error(error); });
}
