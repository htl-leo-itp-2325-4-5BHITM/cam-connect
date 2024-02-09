export const config = {
    api_url: "http://localhost:8080/api",
    socket_url: "ws://localhost:8080/api"
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

export enum ColorEnum {ACCENT="accent", GOOD="good", MID="mid", BAD="bad", GRAY="gray"}
export enum SimpleColorEnum {ACCENT="accent", GRAY="gray"}
export enum SizeEnum {BIG="big", MEDIUM="medium", SMALL="small"}

export class api{
    /**
     * querys the backend and returns the resulting data
     * @param url
     */
    static fetchData<T>(url: string): Promise<T> {
        return fetch(config.api_url + url)
            .then(response => {
                handleHttpError(response.status, url)
                return response.json() as Promise<ccResponse<T>>
            })
            .then(result => {
                if(result.ccStatus) handleCCError(result.ccStatus.statusCode, result.ccStatus.details, url)
                else console.error("no ccResponse object received from", url, "only got:", result)
                return result.data
            })
    }

    /**
     * updates the data at the specified path with the given id.
     * @param path should start with a / will automatically be surrounded by the api url and get and update paths
     * @param id
     * @param data
     */
    static updateData<T>(path: string, id: number, data: T): Promise<T> {
        return fetch(`${config.api_url}${path}/getbyid/${id}/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            handleHttpError(response.status, path)
            return response.json() as Promise<ccResponse<T>>
        })
        .then(result => {
            handleCCError(result.ccStatus.statusCode, result.ccStatus.details, path)
            return result.data
        })
    }

    static createItem<T>(path: string, data: T): Promise<T> {
        return fetch(`${config.api_url}${path}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            handleHttpError(response.status, path)
            return response.json() as Promise<ccResponse<T>>
        })
        .then(result => {
            handleCCError(result.ccStatus.statusCode, result.ccStatus.details, path)
            return result.data
        })
    }
}

export function handleCCError(statusCode: number, details: string, url:string) {
    if(statusCode == 1000) return
    console.log("something went wrong in the backend trying to reach endpoint: ", url, "statusCode: ", statusCode + ". Details:", details)
}

export function handleHttpError(statusCode: number, url:string){
    if(statusCode >= 200 && statusCode < 300) return
    console.log("fatal server error occured trying to reach endpoint: ", url, "statusCode: ", statusCode)
}

interface breakpoint {
    size: number,
    key: string
}

export class WidthResizeObserver {
    source: HTMLElement
    breakpoints: breakpoint[]
    constructor(source: HTMLElement, breakpoints: breakpoint[]) {
        this.source = source
        this.breakpoints = breakpoints.sort((a, b) => a.size - b.size)

        new ResizeObserver(() => {
            window.requestAnimationFrame(() => {
                let newSize = this.breakpoints.at(-1).key;

                for (let i = 0; i < this.breakpoints.length; i++) {
                    const breakpoint = this.breakpoints[i];
                    if (this.source.clientWidth > breakpoint.size && this.source.clientWidth < this.breakpoints[i + 1]?.size) {
                        console.log("match", breakpoint.key)
                        newSize = breakpoint.key;
                        break;
                    }
                }

                console.log(newSize)

                if (this.source.getAttribute("size") !== newSize) {
                    this.source.setAttribute("size", newSize); // Update size attribute only if it has changed
                }
            })
        }).observe(this.source)

        console.log(source, breakpoints)
    }
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