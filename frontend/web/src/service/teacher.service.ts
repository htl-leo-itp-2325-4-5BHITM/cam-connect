import {model} from "../index"
import {api} from "../base"

export interface Teacher{
    teacher_id: number,
    firstname: string,
    lastname: string,
    email: string,
    username: string
}

export default class RentService{
    static fetchAll(){
        api.fetchData<Teacher[]>("/teacher/getall")
            .then(data => {
                model.loadTeachers(data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}