import PopupEngine from "./PopupEngine"
import {ccResponse, ccStatus, config} from "../base"
import {model} from "../index"

export class Api {
    /**
     * querys the backend and returns the resulting data
     * @param url
     */
    static getData<Out>(url: string): Promise<ccResponse<Out>> {
        return fetch(config.api_url + url, {
            headers: {
                "Authorization": `Bearer ${model.appState.value.access_token}`
            }
        })
            .then(response => {
                if(this.handleHttpError(response.status, response.url)) {
                    return response.json() as Promise<ccResponse<Out>>
                }
                return {} as Promise<ccResponse<Out>>
            })
            .then((result: ccResponse<Out>) => {
                this.handleCCError(result.ccStatus, url)
                return result
            })
    }

    static async putData<In, Out>(url: string, data?: In): Promise<ccResponse<Out>> {
        let response = await fetch(config.api_url + url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${model.appState.value.access_token}`
            },
            body: JSON.stringify(data),
        })

        this.handleHttpError(response.status, response.url)

        let result: ccResponse<Out> = await response.json()

        this.handleCCError(result.ccStatus, url)

        return result
    }

    static async postData<In, Out>(path: string, data: In, type: "upload" | "json" = "json"): Promise<any> {
        let response

        if(type == "json"){
            response = await fetch(`${config.api_url}${path}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${model.appState.value.access_token}`
                },
                body: JSON.stringify(data),
            })
        }
        if(type == "upload") {
            response = await fetch(`${config.api_url}${path}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${model.appState.value.access_token}`
                },
                body: data as any,
            })
        }

        this.handleHttpError(response.status, response.url)

        let result: ccResponse<Out> = await response.json()

        this.handleCCError(result.ccStatus, path)

        return result
    }

    static handleCCError(status: ccStatus, url:string): boolean {
        if(!status) {
            console.error("no ccResponse object received from", url)
            return false
        }

        if(status.statusCode == 1000) return true
        if(status.statusCode == 1101) {
            console.error(`CCException - invalid id in getter - statuscode: ${status.statusCode} - details: ${status.details} - url: ${url}`)

            PopupEngine.createNotification({
                heading: "Ein Fehler ist aufgetreten",
                text: "Die angeforderten Daten konnten nicht geladen werden - ccStatus: 1101",
            })
        }
        console.error("something went wrong in the backend trying to reach endpoint: ", url, "statusCode: ", status.statusCode + ". Details:", status.details, ". Message:", status.message)
        return false
    }

    static handleHttpError(statusCode: number, url:string):boolean{
        if(statusCode >= 200 && statusCode < 300) return true
        else return false
    }
}