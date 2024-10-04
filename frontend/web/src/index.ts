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

import "./components/navigation/sidebar.component"
import "./components/navigation/navbar.component"
import "./components/navigation/toolbar.component"
import "./components/app/createRent.component"
import "./components/app/createRent-DeviceEntry.component"
import "./components/app/rentList.component"
import "./components/app/rentListStudent.component"
import "./components/app/rentListEntry.component"
import "./components/app/deviceList.component"
import "./components/app/deviceListEntry.component"
import "./components/app/deviceSetListEntry.component"
import "./components/app/rentDetailView.component"

import "./components/app/edit/deviceTypeEdit.component"
import "./components/app/edit/deviceTypeEditEntry.component"
import "./components/app/edit/deviceTypeChildren.component"
import "./components/app/edit/deviceTypeChildrenEntry.component"
import "./components/app/edit/editDeviceTypeModal.component"
import "./components/app/edit/editDeviceModal.component"
import "./components/app/edit/deviceSetEdit.component"
import "./components/app/edit/deviceSetEditEntry.component"
import "./components/app/edit/editDeviceSetModal.component"

import "./components/app/app.component"
import "./components/app/dashboard.component"
import "./components/externalConfirm.component"
import "./components/notFound.component"
import "./components/login.component"
import "./components/userSettings.component"
import "./components/app/edit/edit.component"

import "./printView"

import 'air-datepicker/air-datepicker.css';
import '../styles/index.scss'

import Model, {ObservedProperty, PageEnum} from "./model"
import PopupEngine from "./util/PopupEngine";
import UrlHandler from "./util/UrlHandler"

import favicon from "../assets/logo/cc-logomark-accent.svg"
import {KeyBoardShortCut} from "./util/KeyboardShortcut"
import {AppComponent} from "./components/app/app.component"
import AuthService from "./service/auth.service"

//OMG its our single swouce of THWQUUUCE
export let model = new Model()

window.addEventListener("DOMContentLoaded", () => {
    UrlHandler.parseCurrentURL()

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

document.body.appendChild(new AppComponent())