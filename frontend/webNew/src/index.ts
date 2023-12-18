//components
import "./components/basic/button-component"
import "./components/basic/chip-component"
import "./components/basic/confirmation-status-component"
import "./components/basic/filter-container-component"
import "./components/basic/circle-select-component"
import "./components/basic/property-value-component"
import "./components/basic/select-element-component"
import "./components/basic/select-component"
import "./components/basic/value-chain-component"
import "./components/layout/filter-component"

//services
import {getAllDeviceTypes} from "./service/devicetype-service";

//css
import "../styles/index.scss"

//TODO check if we can use the same svg stuff here as in the components or othe way round
import '@fortawesome/fontawesome-free/js/all'

//basically einfach default function file für erstellen clicken popups und alles

let filters = document.createElement('cc-filter');

let filterblock = document.createElement("cc-filter-container")
filterblock.options = [{name:"kamera"}, {name:"dings"}, {name:"halli"}]
filters.appendChild(filterblock)

document.body.appendChild(filters)

console.log(await getAllDeviceTypes())
