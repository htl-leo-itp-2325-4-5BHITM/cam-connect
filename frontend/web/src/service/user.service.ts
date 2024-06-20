import {Api} from "../util/Api"
import {model} from "../index"
import {Teacher} from "./teacher.service"
import UrlHandler from "../util/UrlHandler"

export interface User{
    username: string,
    password: string,
}

export default class UserService {
    static async login(username, password) {
        let response = await Api.postData("/user/login", {username: username, password: password})
        if(true){
            UrlHandler.updateUrl("/app/rents")
        }
        else{
            return response
        }
    }
}