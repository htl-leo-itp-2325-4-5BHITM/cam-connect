import {DeviceType} from "./service/deviceTypeService"
import {FilterOption} from "./components/basic/filterBlock.component"
import {DeviceTypeAttribute} from "./service/deviceTypeAttributeService"
export default class Util{
    static deviceTypeToFilterOption(deviceTypes: DeviceType): FilterOption{
        return {
            name: deviceTypes.name,
            id: deviceTypes.type_id,
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
        }
    }

    /**
     * Loops over a provided array of JSON objects and checks if the id key matches with the provided one.
     * If a match is found, it is returned; if no match is found, null is returned.
     *
     * @template T The type of the elements in the array, must have an 'id' property of type number or string.
     * @param data
     * @param id
     * @return {T | null}
     */
    /*What does this code mean:
        - T is a type that is passed to the function when called, this makes sure that the type stays consistent with
          input and return and that typescript knows what the return value is and doesn't complain.
        - The type T is anything that the caller inputs but it *has* to extend this simple object. AKA it has to have an
          id property.
        - the id can be either a number or a string its type is a union type of string and number
     */
    static getItemByIdFromJsonArray<T extends {id:(number | string)}>(data: T[], id: (number | string)):T {
        for (let i = 0; i < data.length; i++) {
            if(data[i]?.id === id){
                return data[i]
            }
        }
        return null
    }
}

