import {LitElement, css, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/layout/deviceList.styles.scss'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import {ButtonColor, ButtonType} from "../basic/button.component"
import {CircleSelectType} from "../basic/circleSelect.component"
import {ColorEnum} from "../../base"
import {Device} from "../../service/device.service"
import {model} from "../../index";

@customElement('cc-device-list')
export class DeviceListComponent extends LitElement {
    render() {
        let count = 0;

        return html`
            <style>${styles}</style>
            
            ${model.devices.value.map(device => {
                return this.generateStudent(count++)
            })}
        `
    }

    generateStudent(count: number){
        return html`
            <cc-device-list-entry deviceNumber="${count}"></cc-device-list-entry>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-device-list": DeviceListComponent
    }
}