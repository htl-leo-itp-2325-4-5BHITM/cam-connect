import {model} from "../index"
import {Api} from "../util/Api"
import {User} from "./user.service"

export interface Teacher extends User{}

export default class TeacherService {
    static fetchAll(){
        Api.fetchData<Teacher[]>("/teacher/getall")
            .then(response => {
                model.loadTeachers(response.data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}