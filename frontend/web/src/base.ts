export const config = {
    api_url: "http://localhost:8080/api"
}

export function handleError(statusCode: number) {
    if(statusCode >= 200 && statusCode < 300) return
    console.log("fatal server error occured", statusCode)
}