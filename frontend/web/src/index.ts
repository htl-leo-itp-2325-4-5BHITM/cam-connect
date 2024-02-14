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
import "./components/layout/createRent.component"
import "./components/layout/rentList.component"
import "./components/layout/rentListStudent.component"
import "./components/layout/rentListEntry.component"
import "./components/layout/deviceList.component"
import "./components/layout/deviceListEntry.component"

import "./components/app.component"

//css
import '../styles/index.scss'
import Model, {ObservedProperty, PageEnum} from "./model"
import {KeyBoardShortCut} from "./base"

//OMG its our single swouce of THWQUUUCE
export let model = new Model()
model.appState.subscribe(data => {
    console.log(data)
})

setTimeout(() => {
    const app = document.createElement("cc-app")
    document.body.appendChild(app)
},100)