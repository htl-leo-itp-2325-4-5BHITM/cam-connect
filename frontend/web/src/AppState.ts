import {RentListEntryComponent} from "./components/layout/rentListEntry.component"
import {PageEnum} from "./model"
import {model} from "./index"
import {CreateRentComponent} from "./components/layout/createRent.component"
import {KeyBoardShortCut} from "./base"
import {AutocompleteComponent} from "./components/basic/autocomplete.component"
import {Student} from "./service/student.service"

interface actionCancellation {
    identifier: string,
    action: () => void
}

export class AppState{
    private _page: PageEnum = PageEnum.RENTS
    private _createRentModalOpen: boolean = false
    private _createMultiRentModalOpen: boolean = false
    private _selectedRentEntries: Set<RentListEntryComponent> = new Set<RentListEntryComponent>()
    private _cancelCurrentAction: actionCancellation[] = []
    private _createRentComponent: CreateRentComponent

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

    openCreateRentModal(){
        if(this._createRentModalOpen) return

        //super weird js behavior here: when passing only the function reference instead of an anonymous function
        //the "this" reference in the CreateRent class will be the AppState, try adding a log of "this" in the cancel method
        this.addCurrentActionCancellation(() => { this._createRentComponent?.cancel() }, "createRentModal")
        KeyBoardShortCut.register(["shift", "g"], () => { this._createRentComponent?.addDevice() }, "addDevice", true)
        KeyBoardShortCut.register(["control", "enter"], () => { this._createRentComponent?.create() }, "createRent", true)
        this._createRentModalOpen = true

        let studentSelector = this._createRentComponent.shadowRoot.querySelector(".studentSelector") as AutocompleteComponent<Student>
        setTimeout(() => {
            studentSelector.setFocus()
        },300)

        this._createRentComponent.addDevice()

        this.update()
    }

    get createRentModalOpen(): boolean {
        return this._createRentModalOpen
    }

    get createMultiRentModalOpen(): boolean {
        return this._createMultiRentModalOpen
    }

    set createMultiRentModalOpen(value: boolean) {
        this._createMultiRentModalOpen = value
        this.update()
    }

    get selectedRentEntries(): Set<RentListEntryComponent> {
        return this._selectedRentEntries
    }

    addSelectedRentEntry(rentEntry: RentListEntryComponent){
        this.selectedRentEntries.add(rentEntry)
        this.update()
    }

    removeSelectedRentEntry(rentEntry: RentListEntryComponent){
        this.selectedRentEntries.delete(rentEntry)
        this.update()
    }

    get cancelCurrentAction(): () => void {
        if(this._cancelCurrentAction.length <= 0) return () => {}
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

    set createRentComponent(value: CreateRentComponent) {
        this._createRentComponent = value
        this.update()
    }

    get createRentComponent(): CreateRentComponent {
        return this._createRentComponent
    }
}
