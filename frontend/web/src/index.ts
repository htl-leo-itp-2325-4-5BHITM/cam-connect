//components
import "./components/basic/button.component"
import "./components/basic/chip.component"
import "./components/basic/rentStatus.component"
import "./components/basic/filterBlock.component"
import "./components/basic/circleSelect.component"
import "./components/basic/propertyValue.component"
import "./components/basic/selectElement.component"
import "./components/basic/select.component"
import "./components/basic/valueChain.component"
import "./components/basic/line.component"
import "./components/basic/toggle.component"

import "./components/layout/filterSidebar.component"
import "./components/layout/navbar.component"

//css
import "../styles/index.scss"

import '@fortawesome/fontawesome-free/js/all'
import Model, {ObservedProperty} from "./model"
import {BehaviorSubject} from 'rxjs';
import {FilterSidebarComponent} from "./components/layout/filterSidebar.component"
import Util from "./util"
import {FilterBlockComponent, FilterOption} from "./components/basic/filterBlock.component"
import {NavbarComponent} from "./components/layout/navbar.component"
import {RentListComponent} from "./components/layout/rentList.component"

//region navbar
let navbar = new NavbarComponent();
let optionSelected = navbar.optionSelected

document.querySelector('nav').appendChild(navbar)
//endregion

//region sidebar
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

model.devices.subscribe(data => {
    console.log(data)
})


let filterSidebar = new FilterSidebarComponent("Michael Leisch");

/**
 * Contains all the filter elements for
 */
let filterElements = {
    resolutions: new FilterBlockComponent("Auflösungen"),
    sensors: new FilterBlockComponent("Sensoren"),
    systems: new FilterBlockComponent("Kameratypen"),
    lensMounts: new FilterBlockComponent("Objektiv Anschlüsse"),
    tripodHeads: new FilterBlockComponent("Stativköpfe")
}

let deviceTypes = new FilterBlockComponent("Gerätetyp")
deviceTypes.options = new ObservedProperty<FilterOption[]>(deviceTypes, deviceTypeFilterSubject)
deviceTypes.selectOptionsUpdated = (options) => {setFilterHtmlVisibility(options)}
deviceTypes.setAttribute("slot", "primaryFilters")
filterSidebar.appendChild(deviceTypes)

filterElements.resolutions.options = new ObservedProperty<FilterOption[]>(filterElements.resolutions, model.deviceTypeAttributesAsFilterOptions.cameraResolutions)
filterSidebar.appendChild(filterElements.resolutions)
filterElements.sensors.options = new ObservedProperty<FilterOption[]>(filterElements.sensors, model.deviceTypeAttributesAsFilterOptions.cameraSensors)
filterSidebar.appendChild(filterElements.sensors)
filterElements.systems.options = new ObservedProperty<FilterOption[]>(filterElements.systems, model.deviceTypeAttributesAsFilterOptions.cameraSystems)
filterSidebar.appendChild(filterElements.systems)
filterElements.lensMounts.options = new ObservedProperty<FilterOption[]>(filterElements.lensMounts, model.deviceTypeAttributesAsFilterOptions.lensMounts)
filterSidebar.appendChild(filterElements.lensMounts)
filterElements.tripodHeads.options = new ObservedProperty<FilterOption[]>(filterElements.tripodHeads, model.deviceTypeAttributesAsFilterOptions.tripodHeads)
filterSidebar.appendChild(filterElements.tripodHeads)

/**
 * displays or hides filters so that only the ones that belong with the general selection are visibly
 * @param options filteroptions provided by the general devicetype filter
 */
function setFilterHtmlVisibility(options: FilterOption[]){
    //we should probably publish this to the modle and make it available for the future
    let deviceTypeIsSelected = {
        camera: Util.getItemByIdFromJsonArray<FilterOption>(options, "camera").selected,
        drone: Util.getItemByIdFromJsonArray<FilterOption>(options, "drone").selected,
        lens: Util.getItemByIdFromJsonArray<FilterOption>(options, "lens").selected,
        light: Util.getItemByIdFromJsonArray<FilterOption>(options, "light").selected,
        microphone: Util.getItemByIdFromJsonArray<FilterOption>(options, "microphone").selected,
        stabilizer: Util.getItemByIdFromJsonArray<FilterOption>(options, "stabilizer").selected,
        tripod: Util.getItemByIdFromJsonArray<FilterOption>(options, "tripod").selected,
    }

    const allFalse = Object.values(deviceTypeIsSelected).every(value => value !== true ); //not checking for == false since it can be undefined

    if (allFalse) {
        Object.keys(deviceTypeIsSelected).forEach(key => {
            deviceTypeIsSelected[key] = true;
        });
    }

    filterElements.resolutions.style.display = deviceTypeIsSelected.camera || deviceTypeIsSelected.drone ? "" : "none"
    filterElements.sensors.style.display = deviceTypeIsSelected.camera || deviceTypeIsSelected.drone ? "" : "none"
    filterElements.systems.style.display = deviceTypeIsSelected.camera ? "" : "none"
    filterElements.lensMounts.style.display = deviceTypeIsSelected.camera || deviceTypeIsSelected.lens ? "" : "none"
    filterElements.tripodHeads.style.display = deviceTypeIsSelected.tripod ? "" : "none"
}

document.querySelector('main').appendChild(filterSidebar)
//endregion

//region rent list
let rentList = new RentListComponent()

document.querySelector('main').appendChild(rentList)
//endregion