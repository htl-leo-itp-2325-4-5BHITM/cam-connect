import {model} from "../index"
import {api} from "../base"

export interface Student{
    student_id: number,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    username: string,
    favourites: [string],
    school_class: string
}

export default class RentService{
    static fetchAll(){
        api.fetchData<Student[]>("/student/getall")
            .then(data => {
                model.loadStudents(data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}