import {Api} from "../util/Api"
import {model} from "../index"
import {DeviceType} from "./deviceType.service"

export interface User {
    user_id: string
    firstname: string
    lastname: string
    email: string
    username: string
    school_class: string
    role: 'STUDENT' | 'TEACHER' | 'ADMIN'
}

export interface Teacher extends User {}

export interface Student extends User {
    school_class: string
    favourites: DeviceType[]
}

export default class UserService {
    static fetchAll(){
        Api.getData<Student[]>("/user/getallstudents")
            .then(response => {
                model.loadStudents(response.data)
            })
            .catch(error => {
                console.error(error)
            })

        Api.getData<Teacher[]>("/user/getallteachers")
            .then(response => {
                model.loadTeachers(response.data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static getById(id: string){
        return Api.getData<User>(`/user/getbyid/${id}`)
            .then(response => {
                return response.data
            })
    }
}