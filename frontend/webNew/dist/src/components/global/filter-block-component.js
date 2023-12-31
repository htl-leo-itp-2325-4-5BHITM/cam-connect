import { render } from "lit-html";
import styles from '../../../styles/components/global/filter.styles.scss';
/**
 *
 */
class FilterBlockComponent extends HTMLElement {
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
        let name = this.getAttribute("name");
        render(this.filterElement(name), this.shadowRoot);
    }
    filterElement(name) {
        const filterElements = this.querySelectorAll("cc-filter-element");
        const div = document.createElement('div');
        div.setAttribute("class", "filter-block");
        const heading = document.createElement('h2');
        heading.innerHTML = name;
        div.appendChild(heading);
        filterElements.forEach((elem) => {
            div.appendChild(elem);
        });
        return div;
    }
}
customElements.define("cc-filter-block", FilterBlockComponent);
//# sourceMappingURL=filter-block-component.js.map