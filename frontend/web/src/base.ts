import * as trace_events from "trace_events"
import Util from "./util"
import {model} from "./index"
import AirDatepicker from "air-datepicker"
import localeDe from "air-datepicker/locale/de"
import PopupEngine from "./popupEngine"

export const config = {
    api_url: "http://localhost:8080/api",
    socket_url: "ws://localhost:8080/api",
    do_logs: true,
}

export const Regex = {
    anyThingButNumbers: /\D/,
    empty: /^\s*$/,
    onlySpecialChars: /^[^a-zA-Z0-9]*$/,
    onlyNumbersOrLetters: /^[a-zA-Z0-9]*$/,
}

export interface ccResponse<T>{
    ccStatus: ccStatus
    details: {
        time: string
        dataType: string
    }
    data: T
}

export interface ccStatus{
    statusCode: number
    details: string
    message: string
}

export enum ColorEnum {ACCENT="accent", GOOD="good", MID="mid", BAD="bad", GRAY="gray"}
export enum SimpleColorEnum {ACCENT="accent", GRAY="gray"}
export enum SizeEnum {BIG="big", MEDIUM="medium", SMALL="small"}

export interface SimpleOption<ID, DATA> {
    id: ID
    data: DATA
}
export class Api {
    /**
     * querys the backend and returns the resulting data
     * @param url
     */
    static fetchData<Out>(url: string): Promise<Out> {
        return fetch(config.api_url + url)
            .then(response => {
                this.handleHttpError(response.status, response.url)
                return response.json() as Promise<ccResponse<Out>>
            })
            .then((result: ccResponse<Out>) => {
                this.handleCCError(result.ccStatus, url)
                return result.data
            })
    }

    static putData<In>(url: string, data): Promise<ccResponse<null>> {
        return fetch(config.api_url + url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                this.handleHttpError(response.status, response.url)
                return response.json() as Promise<ccResponse<null>>
            })
            .then((result: ccResponse<null>) => {
                this.handleCCError(result.ccStatus, url)
                return result.data
            })
    }

    static async postData<In, Out>(path: string, data: In, type: "upload" | "json" = "json"): Promise<any> {
        let response

        if(type == "json"){
            response = await fetch(`${config.api_url}${path}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
        }
        if(type == "upload") {
            response = await fetch(`${config.api_url}${path}`, {
                method: "POST",
                body: data as any,
            })
        }

        this.handleHttpError(response.status, response.url)

        let result: ccResponse<Out> = await response.json()
        this.handleCCError(result.ccStatus, path)

        return result
    }

    static handleCCError(status: ccStatus, url:string): boolean {
        if(!status)  console.error("no ccResponse object received from", url)

        if(status.statusCode == 1000) return true
        if(status.statusCode == 1101) {
            console.error(`CCException - invalid id in getter - statuscode: ${status.statusCode} - details: ${status.details} - url: ${url}`)

            PopupEngine.createNotification({
                heading: "Ein Fehler ist aufgetreten",
                text: "Die angeforderten Daten konnten nicht geladen werden - ccStatus: 1101",
            })
        }
        console.error("something went wrong in the backend trying to reach endpoint: ", url, "statusCode: ", status.statusCode + ". Details:", status.details, "Message:", status.message)
        return false
    }

    static handleHttpError(statusCode: number, url:string):boolean{
        if(statusCode >= 200 && statusCode < 300) return true
        else return false
    }
}

interface ResizeBreakpoint {
    size: number,
    key: string
}
export class WidthResizeObserver {
    source: HTMLElement
    breakpoints: ResizeBreakpoint[]
    lastWidth: number
    constructor(source: HTMLElement, breakpoints: ResizeBreakpoint[]) {
        this.source = source
        this.breakpoints = breakpoints.sort((a, b) => a.size - b.size)

        new ResizeObserver(() => {
            window.requestAnimationFrame(() => {
                if(Math.abs(this.lastWidth - this.source.clientWidth) < 10) return
                this.lastWidth = this.source.clientWidth

                let newSize = this.breakpoints.at(-1).key;

                for (let i = 0; i < this.breakpoints.length; i++) {
                    const breakpoint = this.breakpoints[i];
                    if (this.source.clientWidth > breakpoint.size && this.source.clientWidth < this.breakpoints[i + 1]?.size) {
                        newSize = breakpoint.key;
                        break;
                    }
                }

                if (this.source.getAttribute("size") !== newSize) {
                    this.source.setAttribute("size", newSize); // Update size attribute only if it has changed
                }
            })
        }).observe(this.source)
    }
}


//TODO the color of the keyboard nav effect is always the same and not visible inside a date range
//this is not a problem with out implementation but with the library, its the same in the examples
export class DatePickerWrapper{
    instance: AirDatepicker
    lastSelection = [new Date(), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)]
    static pickerIsOpen = false

    constructor(input: HTMLInputElement, selectedDates = [new Date(), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)], onSelect = (dates: Date[]) => {}){
        this.instance = new AirDatepicker(input, {
            locale: localeDe,
            range: true,
            dateFormat: "dd.MM",
            multipleDatesSeparator: ' - ',
            selectedDates: selectedDates,
            autoClose: true,
            moveToOtherMonthsOnSelect: false,
            toggleSelected: false,
            onShow: (finished) => {
                if(finished) return //onShow gets called twice, once on animation start and a second time on animation end
                DatePickerWrapper.pickerIsOpen = true
                //the datepicker handles its own close by esc, to prevent another close action from getting called this
                // dummy is added
                model.appState.value.addCurrentActionCancellation(()=>{}, "datepicker")
            },
            onHide: (finished) => {
                if(finished) return //onHide gets called twice, once on animation start and a second time on animation end
                DatePickerWrapper.pickerIsOpen = false
                if(this.instance.selectedDates.length == 1){//prevents only one date from being selected
                    this.instance.clear()
                    this.instance.selectDate([this.lastSelection[0], this.lastSelection[1]])
                }
                else{
                    this.lastSelection = this.instance.selectedDates
                    onSelect(this.instance.selectedDates)
                }
                setTimeout(() => {
                    if(!DatePickerWrapper.pickerIsOpen)
                        model.appState.value.removeCurrentActionCancellation("datepicker")
                },100)
            }
        })
    }
}

export class Tooltip {
    static tooltip:HTMLElement
    static lastTimeHidden = 0
    static lastTimeShown = 0
    static timeoutFallback

    static show(elem: HTMLElement, text: string, delay: number) {
        if(!this.tooltip) this.tooltip = model.appState.value.appElement.shadowRoot.querySelector("#tooltip")

        clearTimeout(this.timeoutFallback)

        this.lastTimeShown = Date.now()
        this.tooltip.innerText = text

        const bounds = elem.getBoundingClientRect()
        let topOffset = bounds.top - this.tooltip.clientHeight - 10
        if(topOffset < 0) topOffset = bounds.bottom + 5
        this.tooltip.style.top = topOffset + "px" //align the bottom of the toolip with the top of the hovered elem
        this.tooltip.style.left = Math.max(0, bounds.left + bounds.width/2) + "px"

        if (Date.now() - this.lastTimeHidden < 100) { //if the last tooltip was closed less the 100ms ago
            /*this.lastTimeHidden = Date.now()*/
            this.tooltip.style.transitionDelay = "50ms" //show the tooltip after 50ms only
        }
        else {
            this.tooltip.style.transitionDelay = delay + "ms" //show the tooltip after the specified delay
        }

        this.tooltip.style.opacity = String(1)

        this.timeoutFallback = setTimeout(() => {
            this.hide(500)
        },10000)
    }

    /**
     * Hides the visible tooltip after a specified amount of time
     * @param delay
     * @param resetting use when you want an action to reset the "show tooltips instantly when another was just hovered"
     * behaviour. For example when an element is clicked you dont want it to additionally display a tooltip
     */
    static hide(delay: number, resetting: boolean = false){
        this.tooltip.style.transitionDelay = delay + "ms"
        this.tooltip.style.opacity = String(0)

        //if the current tooltip started displaying more than 500ms ago (the tooltip was actually shown)
        //prevents quickly moving over the items from opening the tooltip
        if(Date.now() - this.lastTimeShown > 500)
            this.lastTimeHidden = Date.now()
        if(resetting){
            this.lastTimeShown = Infinity //set to infinity so that the next tooltip will definitely be delayed not instant
            this.lastTimeHidden = 0
        }
    }
}

export interface KeyBoardShortCut {
    keys: string[]
    action: ()=> void
    identifier?: string
    worksInInput?: boolean
}

export class KeyBoardShortCut {
    private static shortCuts: KeyBoardShortCut[] = []
    private static pressedKeys:Set<string> = new Set() //all currently pressed keys

    static register(keys: (string[] | string[][]), action: () => void, identifier?: string, worksInInput: boolean = false){
        if(!Array.isArray(keys[0])) keys = [keys] as string[][]
        keys.forEach(combi => {
            this.shortCuts.push({keys: combi, action: action, identifier: identifier, worksInInput: worksInInput})
        })
    }

    /**
     * removes a registered shortcut by its identifier
     * @param identifier
     */
    static remove(identifier: string){
        this.shortCuts = this.shortCuts.filter(shortCut => shortCut.identifier !== identifier)
    }

    static {
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            //check if an input is currently in focus
            let focusOnInput = false
            let focusedElem = Util.deepEventFocusedElement()
            if(focusedElem instanceof HTMLInputElement) focusOnInput = true

            this.pressedKeys.add(event.key.toLowerCase()) //add the pressed key to set
            this.shortCuts.forEach(shortCut => { //check for every shortcut if all keys are currently pressed
                if(focusOnInput && shortCut.worksInInput == false) return
                //if more or less option keys are pressed then required dont execute the action
                if(shortCut.keys.length != this.pressedKeys.size) return
                if(shortCut.keys.every(key => this.pressedKeys.has(key.toLowerCase()))){
                    event.preventDefault()
                    shortCut.action()
                }
            })
        })

        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this.pressedKeys.delete(event.key.toLowerCase()) //remove the released key from set
        })

        window.addEventListener("blur", () => {
            this.pressedKeys.clear()
        })
    }
}