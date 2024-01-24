import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app.styles.scss'
import {model} from "../../index"
import {PageEnum} from "../../model"

@customElement('cc-equipment')
export class RentComponent extends LitElement {
    render() {
        return html`
            <style>${styles}</style>
            <cc-sidebar accountname="wird später mal ein observable"></cc-sidebar>
            <main>
                <cc-toolbar page="${PageEnum.EQUIPMENT}"></cc-toolbar>
                <p>equipement page</p>
                <cc-button size="big" color="gray" type="text">
                    <div slot="left" class="icon accent">
                        <i class="fa-solid fa-plane"></i>
                    </div>
                    flugzeug
                </cc-button>
                <cc-button size="big" color="gray" type="outlined" text="text"><p slot="left">prefix</p><p slot="right">suffix</p></cc-button>
                <cc-button size="big" color="accent" type="text" text="text"><p slot="right">suffix</p><i slot="left" class="fa-solid fa-cookie-bite"></i></cc-button>
                <cc-button size="big" color="accent" type="filled" text="text"><p slot="right">suffix</p><i slot="left" class="fa-solid fa-cookie-bite"></i></cc-button>
            </main>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-equipment": RentComponent
    }
}