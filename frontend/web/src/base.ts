export const config = {
    api_url: "http://localhost:8080/api"
}

export interface ccResponse<T>{
    ccStatus: {
        statusCode: number
        details: string
        message: string
    }
    details: {
        time: string
        dataType: string
    }
    data: T
}

/**
 * querys the backend and returns the resulting data
 * @param url
 */
export function apiQuery<T>(url: string): Promise<T> {
    return fetch(config.api_url + url)
        .then(response => {
            handleHttpError(response.status)
            return response.json() as Promise<ccResponse<T>>
        })
        .then(result => {
            handleCCError(result.ccStatus.statusCode)
            return result.data
        })
}

export function handleCCError(statusCode: number) {
    if(statusCode == 1000) return
    console.log("something went wrong in the backend", statusCode)
}

export function handleHttpError(statusCode: number){
    if(statusCode >= 200 && statusCode < 300) return
    console.log("fatal server error occured", statusCode)
}

export class Tooltip {
    static tooltip:HTMLElement = document.querySelector("#tooltip")
    static lastTimeHidden = 0
    static lastTimeShown = 0
    static timeoutFallback

    static show(elem: HTMLElement, text: string, delay: number) {
        this.lastTimeShown = Date.now()
        this.tooltip.innerText = text

        const bounds = elem.getBoundingClientRect()
        this.tooltip.style.top = bounds.top - this.tooltip.clientHeight + "px" //align the bottom of the toolip with the top of the hovered elem
        this.tooltip.style.left = bounds.left + "px"

        if (Date.now() - this.lastTimeHidden < 100) { //if the last tooltip was closed less the 100ms ago
            this.tooltip.style.transitionDelay = "50ms" //show the tooltip after 50ms only
        }
        else {
            this.tooltip.style.transitionDelay = delay + "ms" //show the tooltip after the specified delay
        }

        this.tooltip.style.opacity = String(1)
    }

    static hide(delay: number, resetting: boolean = false){
        this.tooltip.style.transitionDelay = delay + "ms"
        this.tooltip.style.opacity = String(0)

        //if the current tooltip started displaying more then 500ms ago - the tooltip was actually shown
        //prevents quickly moving over the items from opening the tooltip
        if(Date.now() - this.lastTimeShown > 500)
            this.lastTimeHidden = Date.now()
        if(resetting){
            this.lastTimeShown = Infinity //set to infinity so that the next tooltip will definitely be delayed not instant
            this.lastTimeHidden = 0
        }
    }
}