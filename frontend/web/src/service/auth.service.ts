import {Api} from "../util/Api"
import {OrderByFilterRent, RentByStudentDTO, RentFilterDTO} from "./rent.service"
import {config} from "../base"
import {model} from "../index"
import UrlHandler from "../util/UrlHandler"
import {UserRoleEnum} from "./user.service"

export interface LoginRequest{
    username: string
    password: string
}

export interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    id_token: string;
    not_before_policy: number;
    session_state: string;
    scope: string;
}

export interface AccessTokenPayload {
    exp: number;
    iat: number;
    jti: string;
    iss: string;
    aud: string;
    sub: string;
    typ: string;
    azp: string;
    sid: string;
    acr: string;
    allowed_origins: string[];
    realm_access: {
        roles: string[];
    };
    resource_access: {
        account: {
            roles: string[];
        };
    };
    scope: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
}

export interface RefreshTokenPayload {
    exp: number;
    iat: number;
    jti: string;
    iss: string;
    aud: string;
    sub: string;
    typ: string;
    azp: string;
    sid: string;
    scope: string;
}

export interface IdTokenPayload {
    exp: number;
    iat: number;
    jti: string;
    iss: string;
    aud: string;
    sub: string;
    typ: string;
    azp: string;
    sid: string;
    at_hash: string;
    acr: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
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
                return JSON.parse(result.data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static validateAccessToken() {
        return fetch(config.api_url + "/auth/validate", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${model.appState.value.access_token}`
            },
            body: model.appState.value.access_token,
        })
            .then(response => {
                if(response.status == 200){
                    return true
                } else {
                    console.log("Access token invalid")
                    this.logOut()
                    return false
                }
            })
    }

    static logOut(){
        console.log("Logging out")
        model.appState.value.setAccessToken(null)
        UrlHandler.setUrl("/login")
    }

    static getRole(){
        return Api.getData<UserRoleEnum>("/auth/role")
            .then(response => {
                return UserRoleEnum[response.data]
            })
            .catch(error => {

            })
    }
}