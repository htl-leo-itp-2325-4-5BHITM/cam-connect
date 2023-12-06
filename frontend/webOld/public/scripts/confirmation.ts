// @ts-ignore
const APPLICATION_URL: string = " https://2c14-185-51-129-49.ngrok.io/api"
// @ts-ignore
PopupEngine.init({textColor:"black", backgroundColor: "white", elemBackground: "#EEE"})

const urlParams = new URLSearchParams(window.location.search)
let rentId = urlParams.get("id")
let code = urlParams.get("vcode")

fetch(APPLICATION_URL + `/rent/getbyid/${rentId}`)
    .then(result => {
        return result.json()
    })
    .then((data) => {
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
                        PopupEngine.createModal({text: `Verleihung wurde erfolgreich bestätigt. Sie können diese Seite nun schließen.`})
                    } else if(verificationStatus == "declined"){
                        //@ts-ignore
                        PopupEngine.createModal({text: `Verleihung wurde erfolgreich abgelehnt. Sie können diese Seite nun schließen.`})
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