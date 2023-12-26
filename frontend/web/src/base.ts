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
 * querys the backend and returnes the resulting data
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