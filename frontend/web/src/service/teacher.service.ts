import {model} from "../index"
import {Api} from "../base"

export interface Teacher{
    teacher_id: number,
    firstname: string,
    lastname: string,
    email: string,
    username: string
}

export default class RentService{
    static fetchAll(){
        Api.fetchData<Teacher[]>("/teacher/getall")
            .then(data => {
                model.loadTeachers(data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}