import {LitElement, html, PropertyValues, render} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import styles from '../../../styles/components/app/app.styles.scss'
import {model} from "../../index"
import {ObservedProperty, PageEnum} from "../../model"
import {AppState} from "../../AppState"
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

@customElement('cc-app')
export class AppComponent extends LitElement {
    @property()
    private appState: ObservedProperty<AppState>

    constructor() {
        super();

        this.appState = new ObservedProperty<AppState>(this, model.appState)

        model.appState.value.appElement = this
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        model.appState.value.overlayElement = this.shadowRoot.querySelector("#overlay") as HTMLElement
    }

    render() {
        return html`
            <style>${styles}</style>
            
            <div id="tooltip"></div>
            <div id="autocompleteSuggestions"></div>
            <div id="overlay" @click="${this.autoCloseOverlay}">
                <div class="content"></div>
            </div>
            
            ${model.appState.value.originElement ? unsafeHTML(model.appState.value.originElement.outerHTML) : ""}
        `
    }

    autoCloseOverlay(event: MouseEvent){
        if(event.composedPath()[0] == this.shadowRoot.querySelector("#overlay")) model.appState.value.closeOverlay()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "cc-app": AppComponent
    }
}