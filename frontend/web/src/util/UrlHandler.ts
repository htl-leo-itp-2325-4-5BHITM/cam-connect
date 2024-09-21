import {model} from "../index"
import {EditPageEnum, PageEnum} from "../model"
import {html, render} from "lit"
import {DeviceTypeVariantEnum} from "../service/deviceType.service"

let pages = {
    app: {
        handler: () => { UrlHandler.changeOrigin("cc-dashboard") },
        children: {
            rents: {
                handler: () => { model.appState.value.page = PageEnum.RENTS },
                children: {
                    details: {
                        handler: () => { UrlHandler.updateUrl("/app/rents/details")
                            console.log("opening details")
                            //TODO because of stuff like this its probably best to move all the logic related to a change in the url to here and only use that
                            UrlHandler.setParam("sid", UrlHandler.getParam("sid"))
                            model.appState.value.openOverlay(
                                html`<cc-rent-detail-view .studentId="${UrlHandler.getParam("sid")}"></cc-rent-detail-view>`,
                                () => { UrlHandler.updateUrl("/app/rents") }
                            )
                        },
                        waitForDom: true
                    },
                }
            },
            equipment: {
                handler: () => { model.appState.value.page = PageEnum.EQUIPMENT },
            },
            calendar: {
                handler: () => { model.appState.value.page = PageEnum.CALENDAR },
            },
            user: {
                handler: () => { UrlHandler.changeOrigin("cc-user-settings") }
            },
            edit: {
                handler: () => {
                    UrlHandler.changeOrigin("cc-edit")
                    model.appState.value.editPage = EditPageEnum.OVERVIEW
                    model.appState.value.editPageType = UrlHandler.getParam("type") as DeviceTypeVariantEnum/* || DeviceTypeVariantEnum.camera*/
                },
                children: {
                    children: {
                        handler: () => { model.appState.value.editPage = EditPageEnum.CHILDREN }
                    },
                    device: {
                        handler: () => { model.appState.value.editPage = EditPageEnum.DEVICE }
                    },
                    devicetype: {
                        handler: () => { model.appState.value.editPage = EditPageEnum.DEVICETYPE }
                    }
                }
            }
        }
    },
    confirm: {
        handler: () => { UrlHandler.changeOrigin("cc-external-confirm") }
    },
    default: {
        handler: () => {
            UrlHandler.updateUrl("app/rents")
            UrlHandler.parseCurrentURL()
        }
    },
    notFound: {
        handler: () => { UrlHandler.changeOrigin("cc-not-found") }
    },
    login: {
        handler: () => { UrlHandler.changeOrigin("cc-login") }
    }
}

export default class UrlHandler {
    static parseCurrentURL () {
        console.log("parsing url")

        let urlSplit = window.location.href.split("?")[0]?.split("/")
        urlSplit.splice(0, 3) //might break if basic url structure changes
        console.log(urlSplit)

        if(urlSplit[0] === "") {
            pages.default.handler()
            return
        }

        this.handlePage(0, pages, urlSplit)
    }

    static changeOrigin(tagName: string){
        model.appState.value.appElement.querySelectorAll(".origin").forEach(elem => {
            elem.remove()
        })
        let elem = document.createElement(tagName)
        elem.classList.add("origin")
        /*console.log("changing orign to", tagName)
        render(elem, model.appState.value.appElement)*/
        model.appState.value.originElement = elem
        model.appState.value.originElementLoaded.next(true)
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

        if(nextPage.waitForDom == true) {
            console.log("waiting")
            model.appState.value.originElementLoaded.subscribe((status) => {
                if(status == true){
                    nextPage.handler()
                    this.handlePage(pageIndex + 1, nextPage.children, currentPath)
                    model.appState.value.originElementLoaded.unsubscribe()
                }
            })
        }
        else {
            console.log("not waiting")
            nextPage.handler()
            this.handlePage(pageIndex + 1, nextPage.children, currentPath)
        }
    }

    /**
     * returns the value of a specific ? param in the url
     * @param param
     */
    static getParam (param: string) : string {
        let searchParams = new URLSearchParams(new URL(window.location.href).search)

        return searchParams.get(param)
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
     * ment for updating the url when navigating the dashboard
     * @param url
     * @param mode
     */
    static updateUrl(url: string, mode: "add" | "replace" = "replace"){
        let params = window.location.href.split("?")[1]

        if(mode == "add") {
            url = UrlHandler.getUrl() + url
        }

        let splitChar = "?"
        if(url.includes("?"))
            splitChar = "&"
        
        window.history.pushState({}, "", url + (params != undefined ? splitChar + params : ""))
    }

    /**
     * sets url and params to what was supplied, also reloads page
     * ment for navigation between whole different pages like app and confirm without keeping any data
     * @param url
     */
    static setUrl(url: string){
        window.location.href = url
    }

    static getUrl(){
        return window.location.pathname + window.location.search
    }

    /**
     * goes to a specific page without changing the params or reloading the page
     * als stores the current url as the back url
     * ment for navgation to sub pages outside the dashboard like edit or user settings
     * @param page
     */
    static goToPage(page: string){
        model.appState.value.updateBackUrl()
        UrlHandler.updateUrl(page)
        UrlHandler.parseCurrentURL()
    }

    static clearParams() {
        window.history.pushState({}, "", window.location.pathname)
    }
}