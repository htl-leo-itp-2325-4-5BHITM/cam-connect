const APPLICATION_URL: string = "http://localhost:8080/api"
// @ts-ignore
PopupEngine.init({textColor:"black", backgroundColor: "white", elemBackground: "#EEE"})

function confirmRent(verificationStatus: string){
    const urlParams = new URLSearchParams(window.location.search)
    let rentId = urlParams.get("id")
    let code = urlParams.get("vcode")
    let verificationMessage = (document.querySelector("#rejectionReason") as HTMLInputElement).value

    fetch(APPLICATION_URL + `/rent/getbyid/${rentId}/confirm`, {
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
        .then(response => response.json())
        .then(data => {
            console.log(data)
            switch (data.ccStatus.statusCode) {
                case 1000:
                    if(verificationStatus == "confirmed"){
                        //@ts-ignore
                        PopupEngine.createModal({text: `Verleihung wurde erfolgreich bestätigt`})
                    } else if(verificationStatus == "declined"){
                        //@ts-ignore
                        PopupEngine.createModal({text: `Verleihung wurde erfolgreich abgelehnt`})
                    }
                    break
                case 1205:
                    //@ts-ignore
                    PopupEngine.createModal({text: `Die Verleihung wurde bereits bestätigt oder abgelehnt`})
                    break
            }
        })
        .catch(error => console.error(error));
}