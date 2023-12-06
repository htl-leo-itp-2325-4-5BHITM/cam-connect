import { render } from "lit-html";
import styles from '../../../styles/components/global/rent-status.styles.scss';
var Status;
(function (Status) {
    Status["VERFUEGBAR"] = "verf\u00FCgbar";
    Status["VERGEBEN"] = "vergeben";
    Status["GESPERRT"] = "gesperrt";
})(Status || (Status = {}));
/**
 * @Param status: is "verfügbar", "vergeben" oder "gesperrt"
 * @Param amount: is the amount of status types
 */
class RentStatusComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement('style');
        style.textContent = styles;
        shadow.appendChild(style);
    }
    connectedCallback() {
        this.render();
    }
    render() {
        const status = this.getAttribute('status');
        const amount = this.getAttribute('amount');
        render(this.rentStatus(status, amount), this.shadowRoot);
    }
    rentStatus(status, amount) {
        let div = document.createElement('div');
        div.classList.add("cc-rent-status");
        div.setAttribute("status", status || "VERFUEGBAR");
        div.setAttribute("amount", amount);
        div.innerHTML = `${amount ? amount : ""} ${status ? status.charAt(0).toUpperCase() : "V"}${status ? status.substring(1, status.length) : "erfügbar"}`;
        return div;
    }
}
customElements.define("cc-rent-status", RentStatusComponent);
//# sourceMappingURL=rent-status-component.js.map