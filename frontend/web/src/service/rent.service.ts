import {model} from "../index"
import {Api, ccResponse, config} from "../base"
import {Device} from "./device.service"
import {Teacher} from "./teacher.service";
import {Student} from "./student.service";
import PopupEngine from "../popupEngine"

export enum RentStatusEnum {CREATED="CREATED", WAITING="WAITING", CONFIRMED="CONFIRMED", DECLINED="DECLINED", RETURNED="RETURNED"}
export interface Rent{
    type: RentTypeEnum
    rent_id: number
    student: Student
    device?: Device
    device_string?: string
    teacher_start: Teacher
    teacher_end: Teacher
    rent_start: string //should be date but couldnt get that to work
    rent_end_planned: string //should be date but couldnt get that to work
    rent_end_actual: string //should be date but couldnt get that to work
    creation_date: string //should be date but couldnt get that to work
    verification_code: string
    verification_message: string
    status: RentStatusEnum
    note: string
}

export interface RentByStudentDTO {
    student: Student
    rentList: [Rent]
}

export enum RentTypeEnum { DEFAULT="DEFAULT", STRING="STRING" }

export interface CreateRentDTO {
    type: RentTypeEnum,
    student_id: number
    device_id?: number
    device_string?: string
    teacher_start_id: number
    rent_start: string //should be date but couldnt get that to work
    rent_end_planned: string //should be date but couldnt get that to work
    note: string
}

export default class RentService {
    static fetchAll() {
        Api.fetchData<RentByStudentDTO[]>("/rent/getall")
            .then(data => {
                model.loadRents(data)
                console.log(data as RentByStudentDTO[])
            })
            .catch(error => {
                console.error(error)
            })
    }

    static createSocketConnection() {
        let socket = new WebSocket(config.socket_url + "/socket/rents");

        socket.onmessage = (m) => {
            RentService.fetchAll()
        }
    }

    static create(rent: CreateRentDTO[]) {
        Api.postData("/rent/create", rent)
            .then(() => {
                model.appState.value.createRentElement.close()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static remove(rent: Rent) {
        Api.fetchData(`/rent/getbyid/${rent.rent_id}/remove`)
            .then(() => {
                RentService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static return(rentId: number) {
        Api.fetchData(`/rent/getbyid/${rentId}/return`)
            .then(() => {
                RentService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static updateProperty(id: number, property: string, data: any) {
        console.log("updated: ")
        let theData = {value: data}
        Api.postData(`/rent/getbyid/${id}/update/${property}`, theData)
            .then((data) => {
                console.log(data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    static requestConfirmation(rent: Rent) {
        Api.fetchData(`/rent/getbyid/${rent.rent_id}/sendconfirmation`)
            .then(() => {
                RentService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static updateStatus(rentId: number, code: string, status: RentStatusEnum, message: string) {
        Api.postData(`/rent/getbyid/${rentId}/updatestatus`, {verification_code: code, status: status, verification_message: message})
            .then((result) => {
                if(result.ccStatus.statusCode == 1000){
                    PopupEngine.createNotification({
                        heading: "Verleih erfolgreich bestätigt",
                    })
                }
                else if(result.ccStatus.statusCode == 1205){
                    PopupEngine.createNotification({
                        heading: "Falscher Bestätigungscode",
                        text: "Wahrscheinlich ist der angegebene Link ungültig."
                    })
                }
            })
            .catch(error => {
                console.error(error)
            })
    }
}