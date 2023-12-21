import {DeviceType} from "./service/devicetype-service"
import {FilterOption, FilterOptionType} from "./components/basic/filter-container-component"

export function deviceTypeToFilterOption(deviceTypes: DeviceType): FilterOption{
    return {
        name: deviceTypes.name,
        id: deviceTypes.type_id,
        type: FilterOptionType[typeof deviceTypes]
    }
}