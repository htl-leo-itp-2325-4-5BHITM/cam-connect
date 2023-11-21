"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var lit_html_1 = require("lit-html");
var Size;
(function (Size) {
    Size["MEDIUM"] = "medium";
    Size["SMALL"] = "small";
})(Size || (Size = {}));
var Type;
(function (Type) {
    Type["FILLED"] = "filled";
    Type["OUTLINED"] = "outlined";
})(Type || (Type = {}));
var Color;
(function (Color) {
    Color["ACCENT"] = "accent";
    Color["GRAY"] = "gray";
})(Color || (Color = {}));
var button = function (size, type, color) { return (0, lit_html_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n<button class='", "-button'>\n    <h2>BUTTON</h2>\n</button>"], ["\n<button class='", "-button'>\n    <h2>BUTTON</h2>\n</button>"])), size.toString()); };
var ButtonComponent = (function (_super) {
    __extends(ButtonComponent, _super);
    function ButtonComponent() {
        return _super.call(this) || this;
    }
    ButtonComponent.prototype.connectedCallback = function () {
        var shadow = this.attachShadow({ mode: 'open' });
        var size = this.getSize();
        var type = this.getType();
        var color = this.getColor();
        (0, lit_html_1.render)(button, shadow);
    };
    ButtonComponent.prototype.getSize = function () {
        return this.getAttribute('size');
    };
    ButtonComponent.prototype.getType = function () {
        return this.getAttribute('type');
    };
    ButtonComponent.prototype.getColor = function () {
        return this.getAttribute('color');
    };
    return ButtonComponent;
}(HTMLElement));
customElements.define("cc-button", ButtonComponent);
var templateObject_1;
//# sourceMappingURL=button-component.js.map