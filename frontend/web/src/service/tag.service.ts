import {model} from "../index"
import {DeviceType} from "./deviceType.service"
import {Api} from "../util/Api"
import {ccResponse, SimpleOption} from "../base"

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

    static async search(searchTerm: string, tags: Tag[]): Promise<SimpleOption<number, DeviceType>[]> {
        try {
            const result: ccResponse<SimpleOption<number, DeviceType>[]> = await Api.postData(
                "/tag/search",
                {searchTerm: searchTerm}
            )
            console.log(result)
            return result.data
        } catch (e) {
            console.error(e)
            return []
        }
    }
}