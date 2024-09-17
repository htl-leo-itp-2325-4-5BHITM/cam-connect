import {model} from "../index"
import {Api} from "../util/Api"
import {User} from "./user.service"
import {DeviceType} from "./deviceType.service"

export interface Student extends User {
    school_class: string
    favourites: DeviceType[]
}

export default class StudentService {
    static fetchAll(){
        Api.fetchData<Student[]>("/student/getall")
            .then(response => {
                model.loadStudents(response.data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}