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
import "./components/basic/autocomplete.component"
import "./components/basic/dropdown.component"

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
import "./components/layout/deviceTypeEdit.component"
import "./components/layout/deviceTypeEditEntry.component"
import "./components/layout/deviceTypeChildren.component"
import "./components/layout/deviceTypeChildrenEntry.component"
import "./components/layout/rentDetailView.component"

import "./components/app.component"
import "./components/externalConfirm.component"
import "./components/notFound.component"
import "./components/userSettings.component"
import "./components/edit.component"

import "./printView"

import 'air-datepicker/air-datepicker.css';
import '../styles/index.scss'

import Model, {ObservedProperty, PageEnum} from "./model"
import {Api, KeyBoardShortCut} from "./base"
import PopupEngine from "./popupEngine";
import URLHandler from "./urlHandler"

import favicon from "../assets/logo/cc-logomark-accent.svg"

//OMG its our single swouce of THWQUUUCE
export let model = new Model()
model.queryData()

window.addEventListener("DOMContentLoaded", () => {
    URLHandler.parseCurrentURL()

    document.querySelector('head').innerHTML += `<link rel="shortcut icon" href="${favicon}" type="image/x-icon">`

    PopupEngine.init({
        notificationOffset: {top: "75px", bottom: "10px", left: "300px", right: "10px"},
        defaultNotificationPosition: ["bottom", "right"],
        onModalOpen: () => {
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
})

/*model.appState.subscribe(data => {
    console.log(data)
})*/

KeyBoardShortCut.register(model.appState.value.userSettings.keybinds.newRent, () => {model.appState.value.openCreateRentModal()})
KeyBoardShortCut.register(["escape"], () => {model.appState.value.cancelCurrentAction()}, "cancelCurrentAction", true)

//Api.getbyid("/rent",  1, "/remove").then(data => console.log(data))

//lol i just wanna keep this code around cause i like it.. i dug around trying to find a way to prevent keybinds
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
