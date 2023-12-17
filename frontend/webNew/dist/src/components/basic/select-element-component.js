class SelectElementComponent extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        const div = document.createElement("div");
        div.classList.add("select-element");
        div.addEventListener('click', this.toggleOption.bind(div));
        const option = document.createElement("p");
        option.innerHTML = this.innerHTML;
        div.appendChild(option);
        if (!!this.getAttribute("selected")) {
            this.removeAttribute("selected");
            div.classList.add("active");
        }
        this.innerHTML = "";
        this.appendChild(div);
    }
    toggleOption() {
        if (this.closest(".select").querySelector(".active")) {
            this.closest(".select").querySelector(".active").classList.remove("active");
        }
        this.classList.add("active");
    }
}
customElements.define("cc-select-element", SelectElementComponent);
export {};
//# sourceMappingURL=select-element-component.js.map