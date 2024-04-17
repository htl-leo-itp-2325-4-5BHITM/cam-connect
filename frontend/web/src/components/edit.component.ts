import {LitElement, html} from 'lit'
import {customElement} from 'lit/decorators.js'
import styles from '../../styles/components/edit.styles.scss'
import URLHandler from "../urlHandler"
import DeviceTypeAttributeService from "../service/deviceTypeAttribute.service"
import {AppState} from "../AppState"
import {Api, ccResponse, config} from "../base"
import {model} from "../index"
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

        fetch(`${config.api_url}/devicetype/import/${type}`, {
            method: "POST",
            body: formData,
        })
            .then(response => { return response.json() })
            .then((result) => {
                console.log(result)
            })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-edit": EditComponent
    }
}