//components
import "./components/basic/button-component";
import "./components/basic/chip-component";
import "./components/basic/rent-status-component";
import "./components/basic/filter-container-component";
import "./components/basic/circle-select-component";
import "./components/basic/property-value-component";
import "./components/basic/select-element-component";
import "./components/basic/select-component";
import "./components/basic/value-chain-component";
import "./components/layout/filter-component";
//css
import "../styles/index.scss";
//TODO check if we can use the same svg stuff here as in the components or othe way round
import '@fortawesome/fontawesome-free/js/all';
import Model, { ObservedProperty } from "./model";
import { FilterContainerComponent } from "./components/basic/filter-container-component";
//basically einfach default function file für erstellen clicken popups und alles
export let model = new Model();
console.log(model.deviceTypes);
setTimeout(function () {
    console.log(model.deviceTypes);
}, 2000);
let filters = document.createElement('cc-filter');
let filterblock = new FilterContainerComponent("hallo");
filterblock.options = new ObservedProperty(filterblock, model.deviceTypeFilterOptions);
filters.appendChild(filterblock);
document.querySelector('main').appendChild(filters);
//# sourceMappingURL=index.js.map