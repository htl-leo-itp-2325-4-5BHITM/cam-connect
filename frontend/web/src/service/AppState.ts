import {RentListEntryComponent} from "../components/layout/rentListEntry.component"
import {PageEnum} from "../model"
import PopupEngine from "../popupEngine"
import {BehaviorSubject, Subject} from "rxjs"
import {Teacher} from "./teacher.service"

export class AppState{
    private _page: PageEnum = PageEnum.RENTS
    private _createRentModalOpen: boolean = false
    private _createMultiRentModalOpen: boolean = false
    private _selectedRentEntries: Set<RentListEntryComponent> = new Set<RentListEntryComponent>()
    private _cancelCurrentAction: () => void = () => {}

    readonly selectedRentEntriesChange = new Subject()

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

        PopupEngine.createModal({
            heading: "Verleih erstellen abbrechen",
            text: "Möchtest du den Vorgang wirklich abbrechen? Alle eingegebenen Daten gehen verloren.",
            buttons: [
                {text: "Ja", action: () => {
                        this._createRentModalOpen = false
                    }
                },
                {text: "Nein"}
            ]
        })
    }

    openCreateRentModal(){
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
        this.selectedRentEntriesChange.next(this.selectedRentEntries)
    }

    removeSelectedRentEntry(rentEntry: RentListEntryComponent){
        this.selectedRentEntries.delete(rentEntry)
        this.selectedRentEntriesChange.next(this.selectedRentEntries)
    }

    get cancelCurrentAction(): () => void {
        return this._cancelCurrentAction
    }

    set cancelCurrentAction(value: () => void) {
        this._cancelCurrentAction = value
    }
}