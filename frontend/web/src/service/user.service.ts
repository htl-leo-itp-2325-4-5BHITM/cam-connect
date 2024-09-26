import {Api} from "../util/Api"
import {model} from "../index"
import {DeviceType} from "./deviceType.service"

export interface User {
    user_id: number
    firstname: string
    lastname: string
    email: string
    username: string
    password: string
    creationDate: Date
    lastPWCheck: Date
}

export interface Teacher extends User {}

export interface Student extends User {
    school_class: string
    favourites: DeviceType[]
}

export default class UserService {
    static fetchAll(){
        Api.fetchData<Student[]>("/user/getallstudents")
            .then(response => {
                model.loadStudents(response.data)
            })
            .catch(error => {
                console.error(error)
            })

        Api.fetchData<Teacher[]>("/user/getallteachers")
            .then(response => {
                model.loadTeachers(response.data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}