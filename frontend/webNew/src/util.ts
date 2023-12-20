import {DeviceType} from "./service/devicetype-service"
import {FilterOption, FilterOptionType} from "./components/basic/filter-container-component"

export function deviceTypeToFilterOption(deviceType: DeviceType): FilterOption{
    return {
        name: deviceType.name,
        id: deviceType.type_id,
        type: FilterOptionType[typeof deviceType]
    }
}