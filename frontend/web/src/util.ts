import {DeviceType} from "./service/deviceType-service"
import {FilterOption} from "./components/basic/filter-block-component"
import {DeviceTypeAttribute} from "./service/deviceTypeAttribute-service"
export default class Util{
    static deviceTypeToFilterOption(deviceTypes: DeviceType): FilterOption{
        return {
            name: deviceTypes.name,
            id: deviceTypes.type_id,
            type: typeof deviceTypes
        }
    }

    /**
     * Intakes any deviceTypeAttribute (no matter which variation) and returns a FilterOption that can be used by
     * the filter-block-component
     * @param devicetypeAttribute
     */
    static deviceTypeAttributeToFilterOption(devicetypeAttribute: DeviceTypeAttribute): FilterOption{
        let extras = ("size" in devicetypeAttribute ? devicetypeAttribute.size : "")
            + ("resolution" in devicetypeAttribute ? devicetypeAttribute.resolution : "")

        return {
            name: devicetypeAttribute.name,
            details: devicetypeAttribute.details + " " + extras, //sorry if this space gets annoying at some point
            id: devicetypeAttribute.attribute_id,
            type: typeof devicetypeAttribute
        }
    }
}

