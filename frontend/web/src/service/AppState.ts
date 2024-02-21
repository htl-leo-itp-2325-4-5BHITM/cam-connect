import {RentListEntryComponent} from "../components/layout/rentListEntry.component"
import {PageEnum} from "../model"
import PopupEngine from "../popupEngine"
import {BehaviorSubject, Subject} from "rxjs"
import {Teacher} from "./teacher.service"
import {model} from "../index"
import {forEachResolvedProjectReference} from "ts-loader/dist/instances"

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

    /**
     * there is a really small chance here that this falls victim to a race condition
     * bascially it could happen that the component about to call update()
     */
    update(){
        model.updateAppState(this)
    }

    get page(): PageEnum {
        return this._page
    }

    set page(value: PageEnum) {
        this._page = value
    }

    closeCreateRentModal(overrideChecks: boolean = false){
        if(overrideChecks){
            this._createRentModalOpen = false
            return
        }

        this.addCurrentActionCancellation(()=>{
            PopupEngine.closeModal(true, () => {this.removeCurrentActionCancellation("popup")})
        }, "popup")

        PopupEngine.createModal({
            heading: "Verleih erstellen abbrechen",
            text: "Möchtest du den Vorgang wirklich abbrechen? Alle eingegebenen Daten gehen verloren.",
            buttons: [
                {text: "Ja", action: () => {
                        this._createRentModalOpen = false
                        this.removeCurrentActionCancellation("createRentModal")
                        this.update()
                    }
                },
                {text: "Nein", action: () => {
                        this.removeCurrentActionCancellation("popup")
                        this.update()
                    }}
            ]
        })
    }

    openCreateRentModal(){
        this.addCurrentActionCancellation(this.closeCreateRentModal, "createRentModal")
        this._createRentModalOpen = true
    }

    get createRentModalOpen(): boolean {
        return this._createRentModalOpen
    }

    get createMultiRentModalOpen(): boolean {
        return this._createMultiRentModalOpen
    }

    set createMultiRentModalOpen(value: boolean) {
        this._createMultiRentModalOpen = value
    }

    get selectedRentEntries(): Set<RentListEntryComponent> {
        return this._selectedRentEntries
    }

    addSelectedRentEntry(rentEntry: RentListEntryComponent){
        this.selectedRentEntries.add(rentEntry)
    }

    removeSelectedRentEntry(rentEntry: RentListEntryComponent){
        this.selectedRentEntries.delete(rentEntry)
    }

    get cancelCurrentAction(): () => void {
        if(this._cancelCurrentAction.length < 1) return () => {}
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
    }
}