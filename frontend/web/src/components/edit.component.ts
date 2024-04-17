import {LitElement, html} from 'lit'
import {customElement} from 'lit/decorators.js'
import styles from '../../styles/components/edit.styles.scss'
import {Api, ccResponse, config} from "../base"
@customElement('cc-edit')
export class EditComponent extends LitElement {
    render() {
        let listOfString = ["camera", "drone", "lens", "light", "microphone", "simple", "stabilizer", "tripod"];

        return html`
            <style>${styles}</style>
            <cc-navbar type="simple"></cc-navbar>

            ${
                listOfString.map(type => {
                    return html`
                        <label for="${type}Type">${type + ' Type'} </label>
                        <input type="file" id="${type}Type" 
                               @change="${(event) => {this.importDataFromCsv(event, type)}}" accept=".csv"/>`
                })
            }
        `;
    }
    importDataFromCsv(event: Event, type:string) {
        let input = event.target as HTMLInputElement
        let file:File = input.files[0]
        const formData = new FormData()
        formData.append('file', file, file.name)

        Api.postData(`/devicetype/import/${type}`, formData, "upload")
            .then((data) => {
                console.log(data)
                switch (data.ccStatus.statusCode){
                    case 1000:
                        //@ts-ignore
                        PopupEngine.createNotification({text: `Successfully imported ${type}`})
                        break
                    case 1204:
                        //@ts-ignore
                        PopupEngine.createNotification({text: `Konnte nicht importieren weil die filestruktur invalide ist`})
                        break
            }})
            .catch(error => {
                console.error(error)
            })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-edit": EditComponent
    }
}