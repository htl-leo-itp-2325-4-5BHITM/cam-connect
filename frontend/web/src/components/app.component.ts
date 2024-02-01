import {LitElement, html} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../styles/components/app.styles.scss'
import {model} from "../index"
import {AppState, ObservedProperty, PageEnum} from "../model"

@customElement('cc-app')
export class AppComponent extends LitElement {
    @property()
    appState: ObservedProperty<AppState>

    constructor() {
        super();
        this.appState = new ObservedProperty<AppState>(this, model.appState)
    }

    render() {
        let page = html``

        switch (this.appState.value.page) {
            case PageEnum.EQUIPMENT: page = html`<cc-equipment></cc-equipment>`; break
            case PageEnum.RENTS: page = html`<cc-rent></cc-rent>`; break
            case PageEnum.CALENDAR: page = html`<cc-calendar></cc-calendar>`; break
        }

        return html`
            <style>${styles}</style>
            <cc-navbar></cc-navbar>
            ${page}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-app": AppComponent
    }
}