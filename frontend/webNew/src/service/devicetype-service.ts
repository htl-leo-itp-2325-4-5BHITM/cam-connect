//service should request data implement and export interfaces and provide simple set update functions


//region devicetypes
interface DeviceTypeBase{
    type_id: number
    name: string
    image: string
}

export interface CameraType extends DeviceTypeBase{
    windblocker: boolean
    wireless: boolean
    needsRecorder: boolean
}

export interface AudioType extends DeviceTypeBase{
    windblocker: boolean
    wireless: boolean
    needsRecorder: boolean
}
//endregion

//region devicetype attributes
interface CameraResolution{
    resolution_id: number
    name: string
    needsRecorder: boolean
}
//endregion

//index should simply link between components and services