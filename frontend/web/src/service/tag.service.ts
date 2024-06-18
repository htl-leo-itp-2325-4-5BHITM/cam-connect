import {model} from "../index"
import {DeviceType} from "./deviceType.service"
import {Api} from "../Util/Api"

export interface Tag{
    tag_id: number
    name: string
    description: string
    types: DeviceType[]
}

export default class TagService {
    static fetchAll(){
        Api.fetchData<Tag[]>("/tag/getall")
            .then(response => {
                model.loadTags(response.data)
            })
            .catch(error => {
                console.error(error)
            })
    }
}