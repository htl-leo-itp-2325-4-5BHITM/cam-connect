import {model} from "../index"
import {config} from "../base"
import {Device} from "./device.service"
import PopupEngine from "../util/PopupEngine"
import Util from "../util/Util"
import {Api} from "../util/Api"
import {Student, Teacher, UserRoleEnum} from "./user.service"

export enum RentStatusEnum {
    CREATED="CREATED",
    WAITING="WAITING",
    CONFIRMED="CONFIRMED",
    DECLINED="DECLINED",
    RETURNED="RETURNED",
    DELETED="DELETED"
}
export interface Rent{
    type: RentTypeEnum
    rent_id: number
    student: Student
    device?: Device
    device_string?: string
    teacher_start: Teacher
    teacher_end: Teacher
    rent_start: string //should be dates but couldnt get that to work
    rent_end_planned: string
    rent_end_actual: string
    creation_date: string
    change_date: string
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
    type: RentTypeEnum
    student_id: string
    device_id?: number
    device_string?: string
    teacher_start_id: string
    rent_start: string //should be date but couldnt get that to work
    rent_end_planned: string //should be date but couldnt get that to work
    note: string
}

export interface RentFilterDTO {
    orderBy?: OrderByFilterRent
    statuses?: RentStatusEnum[]
    schoolClasses?: string[]
    studentIds?: string[]
    studentSearchTerm?: string
    deviceTypeSearchTerm?: string
}

export enum OrderByFilterRent {
    ALPHABETICAL_ASC="ALPHABETICAL_ASC",
    ALPHABETICAL_DESC="ALPHABETICAL_DESC",
    DATE_ASC="DATE_ASC",
    DATE_DESC="DATE_DESC",
}

export default class RentService {
    static fetchAll() {
        let rentFiltersForBackend: RentFilterDTO = {
            orderBy: model.appState.value.rentFilters.orderBy,
            statuses: model.appState.value.rentFilters.statuses,
            schoolClasses: Array.from(model.appState.value.rentFilters.schoolClasses),
        }

        if(model.appState.value.currentUser?.role != UserRoleEnum.MEDT_TEACHER) {
            rentFiltersForBackend.studentIds = [model.appState.value.currentUser?.user_id]
            rentFiltersForBackend.deviceTypeSearchTerm = model.appState.value.searchTerm
        }
        else{
            rentFiltersForBackend.studentSearchTerm = model.appState.value.searchTerm
        }

        console.log(rentFiltersForBackend)

        Api.postData<RentFilterDTO, RentByStudentDTO[]>("/rent/getall", rentFiltersForBackend)
            .then(result => {
                console.log(result)
                model.loadRents(result.data || [])
            })
            .catch(error => {
                console.error(error)
            })
    }

    static allRentsByStudent(studentId: string) {
        return Api.postData<RentFilterDTO, RentByStudentDTO[]>("/rent/getall",
            {orderBy: OrderByFilterRent.ALPHABETICAL_ASC, studentIds: [studentId]}
        )
            .then(result => {
                return result.data
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
            .then((result) => {
                model.appState.value.createRentElement.close()

                if(result.ccStatus.statusCode == 1201){
                    PopupEngine.createNotification({
                        heading: "Fehler",
                        text: "Dieses gerät ist bereit verliehen"
                    })
                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    static remove(rent: Rent) {
        Api.putData(`/rent/getbyid/${rent.rent_id}/remove`)
            .then(() => {
                RentService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static return(rentId: number) {
        Api.putData(`/rent/getbyid/${rentId}/return`)
            .then(() => {
                RentService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static updateProperty(id: number, property: string, data: any) {
        let theData = {value: data}
        return Api.putData<{value: string}, null>(`/rent/getbyid/${id}/update/${property}`, theData)
    }

    static requestConfirmation(rent: Rent) {
        Api.getData(`/rent/getbyid/${rent.rent_id}/sendconfirmation`)
            .then(() => {
                RentService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }

    /**
     * Updates the status of a rent
     * Aberger heheha
     * @param rentId
     * @param code
     * @param status
     * @param message
     */

    static async confirmOrDecline(rentId: number, code: string, status: RentStatusEnum, message: string) {
        return new Promise((resolve, reject) => {
            Api.postData(`/rent/getbyid/${rentId}/externalconfirmordecline`, {verification_code: code, status: status, verification_message: message})
                .then((result) => {
                    if(result.ccStatus.statusCode == 1000){
                        PopupEngine.createNotification({ heading: "Verleih erfolgreich " + Util.rentStatusToHuman(status), CSSClass: "good" })
                        resolve(true)
                    }
                    else if(result.ccStatus.statusCode == 1205){
                        PopupEngine.createNotification({
                            heading: "Falscher Bestätigungscode",
                            text: "Wahrscheinlich ist der angegebene Link ungültig.",
                            CSSClass: "bad"
                        })
                        resolve(false)
                    }
                    else if(result.ccStatus.statusCode == 1201){
                        PopupEngine.createNotification({
                            heading: "Fehler",
                            text: "Dieser Verleih wurde schon bestätigt oder abgelehnt.",
                            CSSClass: "bad"
                        })
                        resolve(false)
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        })
    }

    static confirm(rentId: number){
        return Api.putData(`/rent/getbyid/${rentId}/confirm`)
            .then(result => {
                RentService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }

    static decline(rentId: number, message: string){
        return Api.postData(`/rent/getbyid/${rentId}/decline`, {message: message})
            .then(() => {
                RentService.fetchAll()
            })
            .catch(error => {
                console.error(error)
            })
    }
}