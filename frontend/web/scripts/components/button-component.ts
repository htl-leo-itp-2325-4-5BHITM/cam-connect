class ButtonComponent extends HTMLElement {
    static observedAttributes = ["value", "type", "size"]

    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" })

        const buttonDiv = document.createElement("button");


        shadow.appendChild(buttonDiv);
    }
}

customElements.define('button-component', ButtonComponent);