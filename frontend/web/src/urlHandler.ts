import {model} from "./index"
import {PageEnum} from "./model"

let pages = {
    app: {
        handler: () => { changeOrigin("cc-app") },
        children: {
            rents: {
                handler: () => { model.appState.value.page = PageEnum.RENTS },
                children: {
                    details: {
                        handler: () => { console.log("showing details") }
                    },
                }
            },
            equipment: {
                handler: () => { model.appState.value.page = PageEnum.EQUIPMENT },
            },
            calendar: {
                handler: () => { model.appState.value.page = PageEnum.CALENDAR },
            },
            edit: {
                handler: () => { changeOrigin("cc-edit") }
            }
        }
    },
    confirm: {
        handler: () => { changeOrigin("cc-external-confirm") }
    },
    default: {
        handler: () => {
            URLHandler.updateUrl("app/rents")
            URLHandler.parseCurrentURL()
        }
    },
    notFound: {
        handler: () => { changeOrigin("cc-not-found") }
    }
}

function changeOrigin(tagName: string){
    document.querySelectorAll(".origin").forEach(elem => {
        elem.remove()
    })
    let elem = document.createElement(tagName)
    elem.classList.add("origin")
    document.body.appendChild(elem)
}

export default class URLHandler {
    static parseCurrentURL () {
        let urlSplit = window.location.href.split("?")[0]?.split("/")
        urlSplit.splice(0, 3) //might break if basic url structure changes

        if(urlSplit[0] === "") {
            pages.default.handler()
            return
        }

        this.handlePage(0, pages, urlSplit)
    }

    /**
     * searches for next part of the url in the provided options and calls the handler
     * @param pageIndex
     * @param options
     * @param currentPath
     */
    static handlePage(pageIndex, options, currentPath){
        if(pageIndex+1 > currentPath.length) return

        let nextPage = options[currentPath[pageIndex]]

        if(!nextPage) {
            pages.notFound.handler();
            return
        }

        nextPage.handler()
        this.handlePage(pageIndex + 1, nextPage.children, currentPath)
    }

    /**
     * returns the value of a specific ? param in the url
     * @param param
     */
    static getParam (param: string) : string {
        let url = window.location.href
        let params = url.split("?")[1]?.split("&")

        let parsedURL = new Map<string, string>()

        for (const paramsKey in params) {
            let key = params[paramsKey].split("=")[0]
            let value = params[paramsKey].split("=")[1]
            parsedURL.set(key, value)
        }

        return parsedURL.has(param) ? parsedURL.get(param) : null
    }

    /**
     * set a ? params value in the url or add it if it does not exist yet
     * @param param
     * @param value
     */
    static setParam (param: string, value: string) {
        let url = window.location.href
        let params = url.split("?")[1]?.split("&")
        url = "?"

        if (!params) {
            params = []
        }

        // check if param is already in the url and if so set its value
        let isAlreadyInURL = false
        for (let i = 0; i < params.length; i++) {
            let keyValue = params[i].split("=")
            if(keyValue[0] === param){
                keyValue[1] = value
                isAlreadyInURL = true
            }
            params[i] = keyValue[0] + "=" + keyValue[1]
        }

        //add the param to the url
        if(!isAlreadyInURL){
            params.push(param + "=" + value)
        }

        // rebuild the url
        for (let i = 0; i < params.length; i++) {
            url += params[i] + (i != params.length - 1 ? "&" : "")
        }

        window.history.replaceState(params, "", url)
    }

    /**
     * updates url to what was supplied without changing the params or reloading the page
     * ment for navigation between pages like equipment and rents
     * @param url
     */
    static updateUrl(url: string){
        let params = window.location.href.split("?")[1]

        window.history.pushState({}, "", url + (params != undefined ? "?" + params : ""))
    }

    /**
     * sets url and params to what was supplied, also reloads page
     * ment for navigation between different pages like app and confirm
     * @param url
     */
    static setUrl(url: string){
        window.location.href = url
    }

    static clearParams() {
        window.history.pushState({}, "", window.location.pathname)
    }
}