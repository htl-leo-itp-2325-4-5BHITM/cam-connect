import {model} from "../index"
import {Api} from "../base"

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