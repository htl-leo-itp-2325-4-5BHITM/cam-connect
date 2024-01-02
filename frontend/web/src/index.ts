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
import {FilterBlockComponent, FilterOption} from "./components/basic/filter-block-component"

//css
import "../styles/index.scss"

//TODO check if we can use the same svg stuff here as in the components or othe way round
import '@fortawesome/fontawesome-free/js/all'
import Model, {ObservedProperty} from "./model"
import {from, BehaviorSubject} from 'rxjs';
import "./components/layout/filterSidebar-component"
import {FilterSidebarComponent} from "./components/layout/filterSidebar-component"
import Util from "./util"

//OMG its our single swouce of THWQUUUCE
export let model = new Model()

//TODO details
let deviceTypeFilterSubject = new BehaviorSubject([
    {name: "Kamera", id: "camera", details: "Kamera halt"},
    {name: "Drone", id: "drone", details: "Drone halt"},
    {name: "Objektiv", id: "lens", details: "Objektiv halt"},
    {name: "Licht", id: "light", details: "Objektiv halt"},
    {name: "Mikrofon", id: "microphone", details: "Mikro halt"},
    {name: "Stabilisator", id: "stabilizer", details: "Stablisationsysteme"},
    {name: "Stativ", id: "tripod", details: "dings"},
])

model.deviceTypes.subscribe(data => {
    console.log(data)
})


let filterSidebar = new FilterSidebarComponent();

let filterHtml = {
    resolutions: new FilterBlockComponent("Auflösungen"),
    sensors: new FilterBlockComponent("Sensoren"),
    systems: new FilterBlockComponent("Kameratypen"),
    lensMounts: new FilterBlockComponent("Objektiv Anschlüsse"),
    tripodHeads: new FilterBlockComponent("Stativköpfe")
}

let deviceTypes = new FilterBlockComponent("Gerätetyp")
deviceTypes.options = new ObservedProperty<FilterOption[]>(deviceTypes, deviceTypeFilterSubject)
deviceTypes.selectOptionsUpdated = setFilterHtmlVisibility
deviceTypes.setAttribute("slot", "primaryFilters")
filterSidebar.appendChild(deviceTypes)

filterHtml.resolutions.options = new ObservedProperty<FilterOption[]>(filterHtml.resolutions, model.deviceTypeAttributesAsFilterOptions.cameraResolutions)
filterSidebar.appendChild(filterHtml.resolutions)
filterHtml.sensors.options = new ObservedProperty<FilterOption[]>(filterHtml.sensors, model.deviceTypeAttributesAsFilterOptions.cameraSensors)
filterSidebar.appendChild(filterHtml.sensors)
filterHtml.systems.options = new ObservedProperty<FilterOption[]>(filterHtml.systems, model.deviceTypeAttributesAsFilterOptions.cameraSystems)
filterSidebar.appendChild(filterHtml.systems)
filterHtml.lensMounts.options = new ObservedProperty<FilterOption[]>(filterHtml.lensMounts, model.deviceTypeAttributesAsFilterOptions.lensMounts)
filterSidebar.appendChild(filterHtml.lensMounts)
filterHtml.tripodHeads.options = new ObservedProperty<FilterOption[]>(filterHtml.tripodHeads, model.deviceTypeAttributesAsFilterOptions.tripodHeads)
filterSidebar.appendChild(filterHtml.tripodHeads)

/**
 * displays or hides filters so that only the ones that belong with the general selection are visibly
 * @param options filteroptions provided by the general devicetype filter
 */
function setFilterHtmlVisibility(options: FilterOption[]){
    let deviceTypeIsSelected = {
        camera: Util.getItemByIdFromJsonArray<FilterOption>(options, "camera").selected,
        drone: Util.getItemByIdFromJsonArray<FilterOption>(options, "drone").selected,
        lens: Util.getItemByIdFromJsonArray<FilterOption>(options, "lens").selected,
        light: Util.getItemByIdFromJsonArray<FilterOption>(options, "light").selected,
        microphone: Util.getItemByIdFromJsonArray<FilterOption>(options, "microphone").selected,
        stabilisator: Util.getItemByIdFromJsonArray<FilterOption>(options, "stabilizer").selected,
        tripod: Util.getItemByIdFromJsonArray<FilterOption>(options, "tripod").selected,
    }
    filterHtml.resolutions.style.display = deviceTypeIsSelected.camera || deviceTypeIsSelected.drone ? "" : "none"
    filterHtml.sensors.style.display = deviceTypeIsSelected.camera || deviceTypeIsSelected.drone ? "" : "none"
    filterHtml.systems.style.display = deviceTypeIsSelected.camera ? "" : "none"
    filterHtml.lensMounts.style.display = deviceTypeIsSelected.camera || deviceTypeIsSelected.lens ? "" : "none"
    filterHtml.tripodHeads.style.display = deviceTypeIsSelected.tripod ? "" : "none"
}


document.querySelector('main').appendChild(filterSidebar)