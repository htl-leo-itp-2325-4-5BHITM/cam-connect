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

import "./components/layout/sidebar.component"
import "./components/layout/navbar.component"
import "./components/layout/toolbar.component"
import "./components/layout/rentList.component"

import "./components/app.component"
import "./components/page/equipment.component"
import "./components/page/rent.component"
import "./components/page/calendar.component"

//css
import '@fortawesome/fontawesome-free/js/all'
import Model, {ObservedProperty, PageEnum} from "./model"
import {BehaviorSubject} from 'rxjs';
import {SidebarComponent} from "./components/layout/sidebar.component"
import Util from "./util"
import {FilterBlockComponent, FilterOption} from "./components/basic/filterBlock.component"
import {NavbarComponent} from "./components/layout/navbar.component"
import {RentListComponent} from "./components/layout/rentList.component"

export let model = new Model()
model.page.subscribe(data => {
    console.log(data)
})

//region navbar
let navbar = document.querySelector('cc-navbar');
//endregion

//region sidebar
//OMG its our single swouce of THWQUUUCE

/*
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
*/

/**
 * displays or hides filters so that only the ones that belong with the general selection are visibly
 * @param options filteroptions provided by the general devicetype filter
 */
/*function setFilterHtmlVisibility(options: FilterOption[]){
    //we should probably publish this to the modle and make it available for the future
    let deviceTypeIsSelected = {
        camera: Util.getItemByKeynameFromJsonArray<FilterOption>(options, "camera").selected,
        drone: Util.getItemByKeynameFromJsonArray<FilterOption>(options, "drone").selected,
        lens: Util.getItemByKeynameFromJsonArray<FilterOption>(options, "lens").selected,
        light: Util.getItemByKeynameFromJsonArray<FilterOption>(options, "light").selected,
        microphone: Util.getItemByKeynameFromJsonArray<FilterOption>(options, "microphone").selected,
        stabilizer: Util.getItemByKeynameFromJsonArray<FilterOption>(options, "stabilizer").selected,
        tripod: Util.getItemByKeynameFromJsonArray<FilterOption>(options, "tripod").selected,
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
}*/
//endregion