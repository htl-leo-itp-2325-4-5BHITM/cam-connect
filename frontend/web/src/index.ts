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
import "./components/notFound.component"
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

window.addEventListener("DOMContentLoaded", () => {
    URLHandler.parseCurrentURL()

    document.querySelector('head').innerHTML += `<link rel="shortcut icon" href="${favicon}" type="image/x-icon">`

    PopupEngine.init({
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

KeyBoardShortCut.register([["shift", "n"], ["<"]], () => {model.appState.value.openCreateRentModal()})
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

const theme = {
    dark: [
        {key: "--accentDark", value: "hsl(201, 50.3%, 37.1%)"},
        {key: "--accent", value: "hsl(200, 50%, 50%)"},
        {key: "--accentLight", value: "hsl(202, 55.1%, 65.1%)"},
        {key: "--accentLight01", value: "hsla(202, 55.1%, 65.1%, 0.1)"},
        {key: "--accentGray", value: "hsl(200, 50%, 10%)"},

        {key: "--gray100", value: "rgba(26, 26, 26, 1)"},
        {key: "--gray150", value: "rgba(33, 33, 33, 1)"},
        {key: "--gray200", value: "rgba(38, 38, 38, 1)"},
        {key: "--gray250", value: "rgba(43, 43, 43, 1)"},
        {key: "--gray300", value: "rgba(46, 46, 46, 1)"},
        {key: "--gray350", value: "rgba(59, 59, 59, 1)"},
        {key: "--gray400", value: "rgba(66, 66, 66, 1)"},
        {key: "--gray500", value: "rgba(89, 89, 89, 1)"},
        {key: "--gray600", value: "rgba(140, 140, 140, 1)"},
        {key: "--gray700", value: "rgba(173, 173, 173, 1)"},
        {key: "--gray800", value: "rgba(204, 204, 204, 1)"},
        {key: "--gray900", value: "rgba(230, 230, 230, 1)"},
        {key: "--gray1000", value: "rgba(255, 255, 255, 1)"},

        {key: "--badLight", value: "hsl(0, 64%, 62%)"},
        {key: "--bad", value: "hsl(0, 45.1%, 50%)"},
        {key: "--badDark", value: "hsl(0, 45.1%, 40%)"},
        {key: "--badGray", value: "hsl(0, 45.1%, 27%)"},
        {key: "--badGrayTransparent", value: "hsla(0, 30.4%, 27.1%, 0.800)"},
        {key: "--badBright", value: "hsl(0, 67.7%, 93.9%)"},
        {key: "--badBright01", value: "hsla(0, 67.7%, 93.9%, 0.1)"},
        {key: "--midLight", value: "hsl(34, 72%, 58%)"},
        {key: "--mid", value: "hsla(32, 59.8%, 40%, 1)"},
        {key: "--midDark", value: "hsla(32, 59.5%, 30%, 1)"},
        {key: "--goodLight", value: "hsl(118, 27%, 60%)"},
        {key: "--good", value: "hsl(119, 21.8%, 43.1%)"},
        {key: "--goodDark", value: "hsl(118, 21.5%, 32%)"},
        {key: "--overlay", value: "hsla(0, 0%, 24.3%, 0.200)"},

        {key: "--hoverBackground", value: "hsla(0, 0%, 50%, 0.35)"},
        {key: "--hoverBackgroundLight", value: "hsla(0, 0%, 50%, 0.2)"},
    ],
    light: [
        {key: "--accentDark", value: "hsl(201, 50.3%, 37.1%)"},
        {key: "--accent", value: "hsl(200, 50%, 50%)"},
        {key: "--accentLight", value: "hsl(202, 55.1%, 65.1%)"},
        {key: "--accentLight01", value: "hsla(202, 55.1%, 65.1%, 0.1)"},
        {key: "--accentGray", value: "hsl(200, 50%, 10%)"},

        {key: "--gray1000", value: "rgb(26, 26, 26)"},
        {key: "--gray900", value: "rgb(33, 33, 33)"},
        {key: "--gray800", value: "rgb(38, 38, 38)"},
        {key: "--gray700", value: "rgb(43, 43, 43)"},
        {key: "--gray600", value: "rgb(46, 46, 46)"},
        {key: "--gray500", value: "rgb(59, 59, 59)"},
        {key: "--gray400", value: "rgb(66, 66, 66)"},
        {key: "--gray350", value: "rgb(89, 89, 89)"},
        {key: "--gray300", value: "rgb(140, 140, 140)"},
        {key: "--gray250", value: "rgb(173, 173, 173)"},
        {key: "--gray200", value: "rgb(204, 204, 204)"},
        {key: "--gray150", value: "rgb(230, 230, 230)"},
        {key: "--gray100", value: "rgb(255, 255, 255)"},

        {key: "--badLight", value: "hsl(0, 64%, 62%)"},
        {key: "--bad", value: "hsl(0, 45.1%, 50%)"},
        {key: "--badDark", value: "hsl(0, 45.1%, 40%)"},
        {key: "--badGray", value: "hsl(0, 45.1%, 27%)"},
        {key: "--badGrayTransparent", value: "hsla(0, 30.4%, 27.1%, 0.800)"},
        {key: "--badBright", value: "hsl(0, 67.7%, 93.9%)"},
        {key: "--badBright01", value: "hsla(0, 67.7%, 93.9%, 0.1)"},
        {key: "--midLight", value: "hsl(34, 72%, 58%)"},
        {key: "--mid", value: "hsla(32, 59.8%, 40%, 1)"},
        {key: "--midDark", value: "hsla(32, 59.5%, 30%, 1)"},
        {key: "--goodLight", value: "hsl(118, 27%, 60%)"},
        {key: "--good", value: "hsl(119, 21.8%, 43.1%)"},
        {key: "--goodDark", value: "hsl(118, 21.5%, 32%)"},
        {key: "--overlay", value: "hsla(0, 0%, 24.3%, 0.200)"},

        {key: "--hoverBackground", value: "hsla(0, 0%, 50%, 0.35)"},
        {key: "--hoverBackgroundLight", value: "hsla(0, 0%, 50%, 0.2)"},
    ]
}

toggleTheme()
function toggleTheme(){
    theme.dark.forEach(variable => {
        document.documentElement.style.setProperty(variable.key, variable.value);
    })
}
