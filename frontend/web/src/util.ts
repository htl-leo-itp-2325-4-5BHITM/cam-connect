import {DeviceType} from "./service/deviceType-service"
import {FilterOption, FilterOptionType} from "./components/basic/filter-container-component"
import {DeviceTypeAttribute} from "./service/deviceTypeAttribute-service"
export default class Util{
    static deviceTypeToFilterOption(deviceTypes: DeviceType): FilterOption{
        return {
            name: deviceTypes.name,
            id: deviceTypes.type_id,
            type: FilterOptionType[typeof deviceTypes]
        }
    }

    static deviceTypeAttributeToFilterOption(devicetypeAttribute: DeviceTypeAttribute): FilterOption{
        let extras = ("size" in devicetypeAttribute ? devicetypeAttribute.size : "")
            + ("resolution" in devicetypeAttribute ? devicetypeAttribute.resolution : "")

        return {
            name: devicetypeAttribute.name,
            details: devicetypeAttribute.details + extras,
            id: devicetypeAttribute.attribute_id,
            type: FilterOptionType[typeof devicetypeAttribute]
        }
    }
}

