//components
import "./components/basic/button.component"
import "./components/basic/chip.component"
import "./components/basic/rentStatus.component"
import "./components/basic/filterContainer.component"
import "./components/basic/circleSelect.component"
import "./components/basic/propertyValue.component"
import "./components/basic/selectElement.component"
import "./components/basic/select.component"
import "./components/basic/valueChain.component"
import "./components/basic/line.component"
import "./components/basic/toggle.component"
import "./components/basic/iconCTA.component"

import "./components/layout/sidebar.component"
import "./components/layout/navbar.component"
import "./components/layout/toolbar.component"
import "./components/layout/rentList.component"
import "./components/layout/rentListEntry.component"

import "./components/page/equipment.component"
import "./components/page/rent.component"
import "./components/page/calendar.component"

import "./components/app.component"

//css
import '../styles/index.scss'
import Model, {ObservedProperty, PageEnum} from "./model"

//OMG its our single swouce of THWQUUUCE
export let model = new Model()
model.page.subscribe(data => {
    console.log(data)
})

setTimeout(() => {
    const app = document.createElement("cc-app")
    document.body.appendChild(app)
},100)

//region sidebar

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