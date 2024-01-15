import {model} from "../index"
import {apiQuery} from "../base"
import {DeviceType} from "./deviceType.service"
import {io, Socket} from "socket.io-client"
import {Device} from "./device.service"

const socket: Socket = io();

enum RentStatus {CREATED, WAITING, CONFIRMED, DECLINED, RETURNED}
export interface Rent{
    rent_id: number
    student: string
    device: Device
    teacher_start: string
    teacher_end: string
    rent_start: Date
    rent_end_planned: Date
    rent_end_actual: Date
    creation_date: Date
    verification_code: string
    verification_message: string
    status: RentStatus
    note: string
}

export interface RentDTO{
    rent_id: number
    student_id: number
    device_id: number
    teacher_start: string
    teacher_end: string
    rent_start: Date
    rent_end_planned: Date
    rent_end_actual: Date
    creation_date: Date
    verification_code: string
    verification_message: string
    status: RentStatus
    note: string
}

export default class DeviceService{
    static fetchAll(){
        socket.on("noArg", () => {

        });
        apiQuery<Device[]>("/devicetype/attribute/getall")
            .then(data => {
                model.setDevices(data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}