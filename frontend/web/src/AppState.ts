import {RentListEntryComponent} from "./components/layout/rentListEntry.component"
import {PageEnum} from "./model"
import {model} from "./index"
import {CreateRentComponent} from "./components/layout/createRent.component"
import {KeyBoardShortCut} from "./base"
import {AutocompleteComponent} from "./components/basic/autocomplete.component"
import {Student} from "./service/student.service"
import {DeviceType} from "./service/deviceType.service"
import {DeviceListEntryComponent} from "./components/layout/deviceListEntry.component"
import {Device} from "./service/device.service"
import RentService, {OrderByFilterRent, RentFilters, RentStatusEnum} from "./service/rent.service"
import {html, render, TemplateResult} from "lit"
import content from "*.styles.scss"

interface actionCancellation {
    identifier: string,
    action: () => void
}

export class AppState{
    private _page: PageEnum = PageEnum.RENTS
    private _createRentModalOpen: boolean = false
    private _createMultiRentModalOpen: boolean = false
    private _selectedRentEntries: Set<RentListEntryComponent> = new Set<RentListEntryComponent>()
    private _selectedDeviceEntries: Set<DeviceListEntryComponent> = new Set<DeviceListEntryComponent>()
    private _cancelCurrentAction: actionCancellation[] = []
    private _createRentElement: CreateRentComponent
    private _appElement: HTMLElement
    private _rentFilters: RentFilters = {orderBy: OrderByFilterRent.ALPHABETICAL_ASC, statuses: [RentStatusEnum.CONFIRMED, RentStatusEnum.DECLINED, RentStatusEnum.WAITING], schoolClasses: new Set<string>()}
    private _overlayElement: HTMLElement
    private _backUrl: string
    /**
     * there is a really small chance here that this possibly falls victim to a race condition
     * but i think we can ignore that for now
     */
    private update(){
        model.updateAppState(this)
    }

    get page(): PageEnum {
        return this._page
    }

    set page(value: PageEnum) {
        this._page = value
        this.update()
    }

    closeCreateRentModal(){
        this._createRentModalOpen = false
        KeyBoardShortCut.remove("addDevice")
        KeyBoardShortCut.remove("createRent")
        this.update()
    }

    openCreateRentModalWithDevices(devices?: Set<DeviceListEntryComponent>){
        devices.forEach(device => {
            let deviceSelector = this._createRentElement.shadowRoot.querySelector("cc-autocomplete") as AutocompleteComponent<Device>
            let deviceId = device.deviceTypeFull.deviceType.type_id;

            if(deviceId){
                deviceSelector.generateSuggestions(undefined, "")
                    .then(() => {
                        deviceSelector.selectSuggestion(deviceId)
                    })
            }
        })
    }

    openCreateRentModal(withStudentId?: number){
        let studentSelector = this._createRentElement.shadowRoot.querySelector("cc-autocomplete.studentSelector") as AutocompleteComponent<Student>

        if(withStudentId){
            studentSelector.generateSuggestions(undefined,"")
                .then(()=>{
                    studentSelector.selectSuggestion(withStudentId)
                })

            //super ugly i know, got something to do with the previous one closing and overriding this one opening
            //TODO cleanup
            setTimeout(() => {
                let firstDeviceSelector = this._createRentElement.shadowRoot.querySelector("cc-create-rent-device-entry")
                    .shadowRoot.querySelector("cc-autocomplete") as AutocompleteComponent<DeviceType>
                firstDeviceSelector?.setFocus()
            },250)
        }
        else{
            setTimeout(() => {
                studentSelector.setFocus()
            },200)
        }

        if(this._createRentModalOpen) return

        //super weird js behavior here: when passing only the function reference instead of an anonymous function
        //the "this" reference in the CreateRent class will be the AppState, try adding a log of "this" in the cancel method
        this.addCurrentActionCancellation(() => { this._createRentElement?.cancel() }, "createRentModal")
        KeyBoardShortCut.register(["shift", "g"], () => { this._createRentElement?.addDevice() }, "addDevice", true)
        KeyBoardShortCut.register(["control", "enter"], () => { this._createRentElement?.create() }, "createRent", true)
        this._createRentModalOpen = true

        this._createRentElement.addDevice("default", false)

        this.update()

        console.table(this._cancelCurrentAction)
    }

    get createRentModalOpen(): boolean {
        return this._createRentModalOpen
    }

    get createMultiRentModalOpen(): boolean {
        return this._createMultiRentModalOpen
    }

    get selectedRentEntries(): Set<RentListEntryComponent> {
        return this._selectedRentEntries
    }

    get selectedDeviceEntries(): Set<DeviceListEntryComponent> {
        return this._selectedDeviceEntries
    }

    addSelectedRentEntry(rentEntry: RentListEntryComponent){
        this.selectedRentEntries.add(rentEntry)
        this.update()
    }

    removeSelectedRentEntry(rentEntry: RentListEntryComponent){
        this.selectedRentEntries.delete(rentEntry)
        this.update()
    }

    addSelectedDeviceEntry (deviceEntry: DeviceListEntryComponent ){
        this.selectedDeviceEntries.add(deviceEntry)
        this.update()
    }

    removeSelectedDeviceEntry(deviceEntry: DeviceListEntryComponent){
        this.selectedDeviceEntries.delete(deviceEntry)
        this.update()
    }

    get cancelCurrentAction(): () => void {
        if(this._cancelCurrentAction.length <= 0) return () => {}
        if(typeof this._cancelCurrentAction.at(-1).action != "function") return () => {}
        return this._cancelCurrentAction.at(-1).action
    }

    /**
     * add an action that will be run when pressing escape (should cancel something else.. close a popup etc)
     * actions get stored in a list, this allows for multiple things to be canceled to be stacked and esc
     * will always cancel the last one
     *
     * @param action a function that will be called
     * @param identifier a identifier used to remove the action once its done
     */
    addCurrentActionCancellation(action: () => void, identifier: string){
        this._cancelCurrentAction.push({identifier: identifier, action: action})
        this.update()
    }

    /**
     * removes the action with the given identifier and all actions after it
     * this results in the next call being to the previous, not yet used action
     * @param identifier
     */
    removeCurrentActionCancellation(identifier: string){
        //remove all actions after the selected one
        this._cancelCurrentAction.forEach((action, index) => {
            if(action.identifier == identifier){
                this._cancelCurrentAction.splice(index, this._cancelCurrentAction.length - index)
            }
        })
        this.update()
    }

    set createRentElement(value: CreateRentComponent) {
        this._createRentElement = value
        this.update()
    }

    get createRentElement(): CreateRentComponent {
        return this._createRentElement
    }

    get appElement(): HTMLElement {
        return this._appElement
    }

    set appElement(value: HTMLElement) {
        this._appElement = value
        this.update()
    }


    get rentFilters(): RentFilters {
        return this._rentFilters
    }

    set rentFilters(value: RentFilters) {
        this._rentFilters = value
        this.update()
        RentService.fetchAll()
    }

    get overlayElement(): HTMLElement {
        return this._overlayElement
    }

    set overlayElement(value: HTMLElement) {
        this._overlayElement = value
        this.update()
    }

    openOverlay(content: TemplateResult){
        this._overlayElement.classList.add("visible")
        this.addCurrentActionCancellation(() => this.closeOverlay(), "overlay")
        render(content, this._overlayElement.querySelector(".content") as HTMLElement)
    }

    closeOverlay(){
        this._overlayElement.classList.remove("visible")
        this.removeCurrentActionCancellation("overlay")
        render(html``, this._overlayElement.querySelector(".content") as HTMLElement)
    }


    get backUrl(): string {
        if(!this._backUrl) {
            return "/app/rents"
        }
        return this._backUrl
    }

    updateBackUrl(){
        this._backUrl = window.location.pathname
        this.update()
    }
}
