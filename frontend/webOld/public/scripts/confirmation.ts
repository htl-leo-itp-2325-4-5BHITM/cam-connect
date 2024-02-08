// @ts-ignore
let APPLICATION_URL: string = "http://localhost:8080/api"

// Check if the protocol is either "http:" or "https:"
if(window.location.hostname !== "localhost"){
    APPLICATION_URL = "http://144.24.171.164/api"
}
// @ts-ignore
PopupEngine.init({textColor:"black", backgroundColor: "white", elemBackground: "#EEE"})

const urlParams = new URLSearchParams(window.location.search)
let rentId = urlParams.get("id")
let code = urlParams.get("vcode")

if (urlParams.get("isAccepted")){
    document.querySelector(".accepted").setAttribute("active", "true");
    confirmRent("confirmed")
} else{
    document.querySelector(".verification").setAttribute("active", "true");
}

fetch(APPLICATION_URL + `/rent/getbyid/${rentId}`)
    .then(result => {
        return result.json()
    })
    .then((data) => {
        data = data.data
        console.log(data)
        document.querySelector('.rentData').innerHTML = `
            <p>${data.student.firstname} ${data.student.lastname}</p>
            <p>Gerät Nr: ${data.device_string}, mit Zubehör: ${data.accessory || "keinem"}</p>
            <p>von: ${data.rent_start}, bis (geplant): ${data.rent_end_planned || "unbekannt"}</p>
        `
    })
    .catch(error => console.error(error))


function confirmRent(verificationStatus: string){
    let verificationMessage = (document.querySelector("#rejectionReason") as HTMLInputElement).value

    fetch(APPLICATION_URL + `/rent/getbyid/${rentId}/confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "verification_code": code || "",
            "status": verificationStatus.toUpperCase() || "",
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
                        PopupEngine.createModal({text: `Verleihung wurde erfolgreich bestätigt. Sie können diese Seite nun schließen.`})
                    } else if(verificationStatus == "declined"){
                        //@ts-ignore
                        PopupEngine.createModal({text: `Verleihung wurde erfolgreich abgelehnt. Sie können diese Seite nun schließen.`})
                    }
                    break
                case 1106:
                    //@ts-ignore
                    PopupEngine.createModal({text: data.ccStatus.message})
                    break
                case 1205:
                    //@ts-ignore
                    PopupEngine.createModal({text: `Die Verleihung wurde bereits bestätigt oder abgelehnt`})
                    break
            }
        })
        .catch(error => console.error(error));
}