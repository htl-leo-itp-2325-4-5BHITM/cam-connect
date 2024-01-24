import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/app.styles.scss'
import {model} from "../index"
import {ObservedProperty, PageEnum} from "../model"

@customElement('cc-app')
export class AppComponent extends LitElement {
    @property()
    selectedPage: ObservedProperty<PageEnum>

    constructor() {
        super();
        this.selectedPage = new ObservedProperty<PageEnum>(this, model.page)
    }

    render() {
        let page = html``

        console.log(this.selectedPage.value)

        switch (this.selectedPage.value) {
            case PageEnum.EQUIPMENT: page = html`<cc-equipment></cc-equipment>`; break
            case PageEnum.RENTS: page = html`<cc-rent></cc-rent>`; break
            case PageEnum.CALENDAR: page = html`<cc-rent></cc-rent>`; break
        }

        return html`
            <style>${styles}</style>
            ${page}
            <cc-navbar></cc-navbar>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-app": AppComponent
    }
}