import Util from "./Util"

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