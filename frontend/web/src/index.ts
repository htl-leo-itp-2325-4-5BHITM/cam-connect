//components
import "./components/basic/button-component"
import "./components/basic/chip-component"
import "./components/basic/rent-status-component"
import "./components/basic/filter-block-component"
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
import {FilterBlockComponent, FilterOption} from "./components/basic/filter-block-component"

//OMG its our single swouce of THWQUUUCE
export let model = new Model()

let deviceTypeFilter:FilterOption[] = [
    {name: "Kamera", type: "CameraType", id: 0, details: "Kamera halt"},
    {name: "Mikrofon", type: "MicrophoneType", id: 1, details: "Mikro halt"},
    {name: "Objektiv", type: "LensType", id: 2, details: "Objektiv halt"}
]

model.deviceTypes.subscribe(data => {
    console.log(data)
})


let filters = document.createElement('cc-filter');

let deviceTypes = new FilterBlockComponent("Gerätetyp")
deviceTypes.options = new ObservedProperty<FilterOption[]>(deviceTypes, model.deviceTypeAttributesAsFilterOptions.cameraResolutions)
deviceTypes.setAttribute("slot", "primaryFilters")
filters.appendChild(deviceTypes)

let resolutions = new FilterBlockComponent("Auflösungen")
resolutions.options = new ObservedProperty<FilterOption[]>(resolutions, model.deviceTypeAttributesAsFilterOptions.cameraResolutions)
filters.appendChild(resolutions)
let sensors = new FilterBlockComponent("Sensoren")
sensors.options = new ObservedProperty<FilterOption[]>(sensors, model.deviceTypeAttributesAsFilterOptions.cameraSensors)
filters.appendChild(sensors)
let systeme = new FilterBlockComponent("Kameratypen")
systeme.options = new ObservedProperty<FilterOption[]>(systeme, model.deviceTypeAttributesAsFilterOptions.cameraSystems)
filters.appendChild(systeme)
let lensMounts = new FilterBlockComponent("Objektiv Anschlüsse")
lensMounts.options = new ObservedProperty<FilterOption[]>(lensMounts, model.deviceTypeAttributesAsFilterOptions.lensMounts)
filters.appendChild(lensMounts)
let tripodHeads = new FilterBlockComponent("Stativköpfe")
tripodHeads.options = new ObservedProperty<FilterOption[]>(tripodHeads, model.deviceTypeAttributesAsFilterOptions.tripodHeads)
filters.appendChild(tripodHeads)


document.querySelector('main').appendChild(filters)