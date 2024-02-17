import {model} from "../index"
import {Api, ccResponse, config} from "../base"
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

export interface CreateRentDTO {
    student_id: number
    device_type_id?: number
    device_number?: string
    device_string?: string
    teacher_start_id: number
    rent_start: Date
    rent_end_planned: Date
    note: string
}

export default class RentService {
    static fetchAll() {
        Api.fetchData<RentByStudentDTO[]>("/rent/getall")
            .then(data => {
                model.loadRents(data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static createSocketConnection() {
        let socket = new WebSocket(config.socket_url + "/socket/rents");

        socket.onmessage = (m) => {
            let result = JSON.parse(m.data) as ccResponse<RentByStudentDTO[]>
            model.loadRents(result.data)
        }
    }

    static create(rent: Rent) {
        Api.createItem("/rent", rent)
            .then(() => {
                RentService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static remove(rent: Rent) {
        Api.getById("/rent", rent.rent_id, "/remove")
            .then(() => {
                RentService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static return(rent: Rent) {
        Api.getById("/return", rent.rent_id, "/return", rent)
            .then(() => {
                RentService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }
}