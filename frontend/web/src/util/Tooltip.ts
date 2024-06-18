import {model} from "../index"

export class Tooltip {
    static tooltip:HTMLElement
    static lastTimeHidden = 0
    static lastTimeShown = 0
    static timeoutFallback

    static show(elem: HTMLElement, text: string, delay: number, autoCloseTimer: number = 10000) {
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
        },autoCloseTimer)
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