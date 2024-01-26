import {model} from "../index"
import {api} from "../base"
import {Device} from "./device.service"
import {Teacher} from "./teacher.service";
import {Student} from "./student.service";

export enum RentStatus {CREATED="CREATED", WAITING="WAITING", CONFIRMED="CONFIRMED", DECLINED="DECLINED", RETURNED="RETURNED"}
export interface Rent{
    rent_id: number
    student: Student
    device: Device
    teacher_start: Teacher
    teacher_end: Teacher
    rent_start: Date
    rent_end_planned: Date
    rent_end_actual: Date
    creation_date: Date
    verification_code: string
    verification_message: string
    status: RentStatus
    note: string
}

export interface RentByStudentDTO {
    student: Student
    rentList: [Rent]
}

export default class RentService{
    static fetchAll(){
        api.fetchData<RentByStudentDTO[]>("/rent/getall")
            .then(data => {
                model.loadRents(data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}