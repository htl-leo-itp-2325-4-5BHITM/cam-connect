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

//css
import "../styles/index.scss"

//TODO check if we can use the same svg stuff here as in the components or othe way round
import '@fortawesome/fontawesome-free/js/all'
import Model, {ObservedProperty} from "./model"
import {deviceTypeToFilterOption} from "./util"
import {FilterContainerComponent, FilterOption} from "./components/basic/filter-container-component"

//basically einfach default function file für erstellen clicken popups und alles

export let model = new Model()

model.deviceTypes.subscribe(data => {
    console.log(data)
})


let filters = document.createElement('cc-filter');

let filterblock = new FilterContainerComponent("hallo")
filters.appendChild(filterblock)

document.querySelector('main').appendChild(filters)