class ButtonComponent extends HTMLElement {
    static observedAttributes = ["size"]

    constructor() {
        super();
    }

    connectedCallback() {
        console.log("testsetstsetst")
        const shadow = this.attachShadow({ mode: "open" })

        const buttonDiv = document.createElement("button");
        buttonDiv.innerHTML = "ich bin dein vater"

        shadow.appendChild(buttonDiv);
    }
}

customElements.define('cam-connect-button', ButtonComponent);