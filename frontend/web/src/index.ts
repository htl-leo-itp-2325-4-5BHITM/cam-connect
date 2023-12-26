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
import "./components/basic/line-component"
import "./components/layout/filter-component"

//css
import "../styles/index.scss"

//TODO check if we can use the same svg stuff here as in the components or othe way round
import '@fortawesome/fontawesome-free/js/all'
import Model, {ObservedProperty} from "./model"
import {FilterContainerComponent, FilterOption} from "./components/basic/filter-container-component"

//OMG its our single swouce of THWQUUUCE
export let model = new Model()

model.deviceTypes.subscribe(data => {
    console.log(data)
})


let filters = document.createElement('cc-filter');

let deviceTypes = new FilterContainerComponent("Gerätetyp")
deviceTypes.options = new ObservedProperty<FilterOption[]>(deviceTypes, model.deviceTypeAttributesAsFilterOptions.cameraResolutions)
filters.appendChild(deviceTypes)

let resolutions = new FilterContainerComponent("Auflösungen")
resolutions.options = new ObservedProperty<FilterOption[]>(resolutions, model.deviceTypeAttributesAsFilterOptions.cameraResolutions)
filters.appendChild(resolutions)
let sensors = new FilterContainerComponent("Sensoren")
sensors.options = new ObservedProperty<FilterOption[]>(sensors, model.deviceTypeAttributesAsFilterOptions.cameraSensors)
filters.appendChild(sensors)
let systeme = new FilterContainerComponent("Kameratypen")
systeme.options = new ObservedProperty<FilterOption[]>(systeme, model.deviceTypeAttributesAsFilterOptions.cameraSystems)
filters.appendChild(systeme)
let lensMounts = new FilterContainerComponent("Objektiv Anschlüsse")
lensMounts.options = new ObservedProperty<FilterOption[]>(lensMounts, model.deviceTypeAttributesAsFilterOptions.lensMounts)
filters.appendChild(lensMounts)
let tripodHeads = new FilterContainerComponent("Stativköpfe")
tripodHeads.options = new ObservedProperty<FilterOption[]>(tripodHeads, model.deviceTypeAttributesAsFilterOptions.tripodHeads)
filters.appendChild(tripodHeads)


document.querySelector('main').appendChild(filters)