import {Api} from "../util/Api"
import {OrderByFilterRent, RentByStudentDTO, RentFilterDTO} from "./rent.service"

interface LoginRequest{
    username: string
    password: string
}

export default class AuthService {

    /**
     * @param username
     * @param password
     * @returns jsonWebToken
     */
    static async login(username, password) {
        return Api.postData<LoginRequest, string>("/auth/login",
            {username: username, password: password}
        )
            .then(result => {
                return result.data
            })
            .catch(error => {
                console.error(error)
            })
    }
}