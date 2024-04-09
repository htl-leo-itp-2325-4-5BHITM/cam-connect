//components
import "./components/basic/button.component"
import "./components/basic/chip.component"
import "./components/basic/rentStatus.component"
import "./components/basic/filterContainer.component"
import "./components/basic/circleSelect.component"
import "./components/basic/propertyValue.component"
import "./components/basic/select.component"
import "./components/basic/valueChain.component"
import "./components/basic/line.component"
import "./components/basic/toggle.component"
import "./components/basic/iconCTA.component"

import "./components/layout/sidebar.component"
import "./components/layout/navbar.component"
import "./components/layout/toolbar.component"
import "./components/layout/createRent.component"
import "./components/layout/createRent-DeviceEntry.component"
import "./components/layout/rentList.component"
import "./components/layout/rentListStudent.component"
import "./components/layout/rentListEntry.component"
import "./components/layout/deviceList.component"
import "./components/layout/deviceListEntry.component"
import "./components/basic/autocomplete.component"

import "./components/app.component"
import "./components/externalConfirm.component"

import "./printView"

import 'air-datepicker/air-datepicker.css';
import '../styles/index.scss'

import Model, {ObservedProperty, PageEnum} from "./model"
import {Api, KeyBoardShortCut} from "./base"
import PopupEngine from "./popupEngine";

//OMG its our single swouce of THWQUUUCE
export let model = new Model()

/*model.appState.subscribe(data => {
    console.log(data)
})*/

PopupEngine.init({
    onModalOpen: () => {
        console.log("modal open")
        model.appState.value.addCurrentActionCancellation(() => {
            PopupEngine.cancelModal()
        }, "modalClose")
        KeyBoardShortCut.register(["Enter"], () => {
            PopupEngine.confirmModal()
        }, "confirmModal", true)
    },
    onModalClose: () => {
        model.appState.value.removeCurrentActionCancellation("modalClose")
        KeyBoardShortCut.remove("confirmModal")
    }
})

document.body.appendChild(document.createElement("cc-external-confirm"))



KeyBoardShortCut.register([["shift", "n"], ["<"]], () => {model.appState.value.openCreateRentModal()})
KeyBoardShortCut.register(["escape"], () => {model.appState.value.cancelCurrentAction()}, "cancelCurrentAction", true)

//Api.getbyid("/rent",  1, "/remove").then(data => console.log(data))

//lol i just wanna keep this code arround cause i like it.. i dug arround trying to find a way to prevent keybinds
// from happening when you are in an input field.. then i realized that keydown has a event.target property
/*setInterval(()=>{
    let focusedElem = document.activeElement
    while (focusedElem != undefined) {
        let newFocusedElem = focusedElem?.shadowRoot?.activeElement
        if(newFocusedElem == undefined) break
        focusedElem = newFocusedElem
    }
    console.log(focusedElem)
}, 2000)*/
