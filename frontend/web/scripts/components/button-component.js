var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ButtonComponent = (function (_super) {
    __extends(ButtonComponent, _super);
    function ButtonComponent() {
        return _super.call(this) || this;
    }
    ButtonComponent.prototype.connectedCallback = function () {
        var shadow = this.attachShadow({ mode: "open" });
        var buttonDiv = document.createElement("button");
        shadow.appendChild(buttonDiv);
    };
    ButtonComponent.observedAttributes = ["value", "type", "size"];
    return ButtonComponent;
}(HTMLElement));
customElements.define('button-component', ButtonComponent);
//# sourceMappingURL=button-component.js.map