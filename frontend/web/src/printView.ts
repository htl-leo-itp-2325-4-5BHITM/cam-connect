import styles from "../styles/printView.styles.scss"
import {model} from "./index"

document.addEventListener("keydown", function (event) {
    if((event.ctrlKey || event.metaKey) && event.key == "p") {
        print();
        event.preventDefault();
        return false;
    }
} , false);

function print() {
    // create a hidden iframe named PrettyPrintFrame
    const printIframe = document.createElement('iframe');

    // add newly created iframe to the current DOM
    document.body.appendChild(printIframe);

    // add generated body content
    printIframe.contentWindow.document.body.innerHTML = generatePrintLayout();

    try {
        // reference to iframe window
        const contentWindow = printIframe.contentWindow;

        // execute iframe print command
        const result = contentWindow.document.execCommand('print', false, null);

        // iframe print listener
        const printListener = contentWindow.matchMedia('print');
        printListener.addListener(function(pl) {
            if (!pl.matches) {
                printIframe.remove()
            }
        });

        // if execCommand is unsupported
        if(!result) { contentWindow.print(); }

    } catch (e) {
        // print fallback
        window.frames['printFrame'].focus();
        window.frames['printFrame'].print();
    }
}

function generatePrintLayout() {
    let html = `<style>${styles}</style>`;
    html += `<table>`
    html += `<tr>    
                <th>Gerät Nr.</th>
                <th>Gerätetyp</th>
                <th>Entlehner*in + Klasse</th>
                <th>Entlehnung Datum</th>
                <th>Paraphe Lehrkraft</th>
                <th>Rückgabe geplant</th>
                <th>Rückgabe tatsächlich</th>
                <th>Paraphe Lehrkraft</th>
                <th>Anmerkung</th>
                <th>Status</th>
            </tr>`

    model.rents.value.map(rentByStudent => {
        rentByStudent.rentList.map(rent => {
            html += `<tr>
                    <td>${rent.device.number}</td>
                    <td>
                        ${rent.device ? rent.device.type.name : rent.device_string}
                    </td>
                    <td>${rent.student.firstname} ${rent.student.lastname} • ${rent.student.school_class}</td>
                    <td>${rent.rent_start}</td>
                    <td>${rent.teacher_start.firstname.charAt(0)}. ${rent.teacher_start.lastname}</td>
                    <td>${rent.rent_end_planned || ""}</td>
                    <td>${rent.rent_end_actual || ""}</td>
                    <td>
                        ${rent.teacher_end ? rent.teacher_end.firstname.charAt(0) : ""}
                        ${rent.teacher_end ? rent.teacher_end.lastname : ""}
                    </td>
                    <td>${rent.note} || ""</td>
                    <td>${rent.status}</td></tr>`
        })
    })

    html += `</table>`
    return html;
}