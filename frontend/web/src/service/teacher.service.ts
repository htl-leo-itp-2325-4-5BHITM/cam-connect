import {model} from "../index"
import {Api} from "../util/Api"

export interface Teacher{
    teacher_id: number,
    firstname: string,
    lastname: string,
    email: string,
    username: string
}

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