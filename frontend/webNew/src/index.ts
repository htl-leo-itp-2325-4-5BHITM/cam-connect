//components
import "./components/basic/button-component"
import "./components/basic/chip-component"
import "./components/basic/rent-status-component"
import "./components/basic/filter-container-component"
import "./components/basic/circle-select-component"
import "./components/basic/property-value-component"
import "./components/basic/select-element-component"
import "./components/basic/select-component"
import "./components/basic/value-chain-component"
import "./components/layout/filter-component"

//services
import {allDeviceTypes} from "./service/devicetype-service";

//css
import "../styles/index.scss"

//TODO check if we can use the same svg stuff here as in the components or othe way round
import '@fortawesome/fontawesome-free/js/all'
import Model, {AsyncController} from "./model"
import {deviceTypeToFilterOption} from "./util"
import {FilterOption} from "./components/basic/filter-container-component"

//basically einfach default function file für erstellen clicken popups und alles

let model = new Model()

console.log(model.deviceTypes)

setTimeout(function(){
    console.log(model.deviceTypes)
},2000)

let filters = document.createElement('cc-filter');

let filterblock = document.createElement("cc-filter-container")
filterblock.options = new AsyncController(filterblock, allDeviceTypes, deviceTypeToFilterOption)
filterblock.model = model
filters.appendChild(filterblock)

document.querySelector('main').appendChild(filters)