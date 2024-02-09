# CamConnect API Doku
- `routename/{pathparam}: {jsonkey, ?optional_jsonkey} -> ReturnValue`
- `iamnotavalidroute -x`
- `iamasocketendpoint ~>`
- 
## Structure
```
api
├── rent -x
│   ├── create -> Rent
│   ├── getall -> [Rent]
│   └── getbyid/{rent_id} -> Rent
│       ├── remove
│       └── update : ?{Rent: student_id.. }
│           ├── student : {value}
│           ├── device : {value}
│           ├── teacherstart : {value}
│           ├── teacherend : {value}
│           ├── rentstart : {value}
│           ├── rentendplanned : {value}
│           ├── rentendactual : {value}
│           ├── note : {value}
│           └── status : {value}
├── device -x
│   ├── create : {type_id, number, serial} -> [Device]
│   ├── getall -> [Device]
│   └── getbyid/{rent_id}
│       ├── remove
│       └── update : {number, serial, note}
│           ├── number : {value}
│           ├── serial : {value}
│           ├── note : {value}
│           └── type: {value}
├── devicetype -x
│   ├── getall -> [DeviceType]
│   ├── create -x
│   │   ├── lens : {f_stop, mount_id, focal_length}
│   │   ├── camera : {system_id, sensor_id, resolution_id, mount_id, framerate, autofocus}
│   │   ├── drone : {sensor_id, resolution_id, max_range
│   │   ├── audio : {windblocker, wireless, needs-recorder}
│   │   ├── light : {watts, rbg, variable_temperatur}
│   │   ├── tripod : {height, head_id}
│   │   └── stabilizer : {max_weight, number_of_axis}
│   ├── getbyid/{type_id} -> DeviceType
│   │   ├── remove
│   │   └── update -x
│   │       ├── lens : {name, f_stop, mount_id, focal_length}
│   │       ├── camera : {name, sensor_id, resolution_id, mount_id}
│   │       ├── drone : {name, sensor_id, resolution_id, max_range
│   │       ├── microphone : {name, windblocker, wireless, needs-recorder}
│   │       ├── light : {name, watts, rbg, variable_temperatur}
│   │       ├── tripod : {name, height, head_id}
│   │       └── stabilizer : {name, max_weight, number_of_axis}
│   └── attribute -x
│       ├── getall -> [DeviceTypeAttribute]
│       ├── create -x
│       │   ├── cameraresolution : {name, details, resolution}
│       │   ├── camerasensor : {name, details, size}
│       │   ├── camerasystem : {name, details}
│       │   ├── lensmount : {name, details}
│       │   └── tripodhead : {name, details}
│       └── getbyid/{attribute_id} -> DeviceTypeAttribute
│           └── remove
├── student -x
├── teacher -x
└── socket
    ├── rents ~> [Rent]
    ├── devices ~> [Device]
    ├── devicetypes ~> [DeviceType]
    ├── students ~> [Student]
    └── teachers ~> [Teacher]
  

```

## Response Structure

- Every Endpoint returns a Response object with standard http Status code to indicate the general status of the request.
- Every Response has a CCResponse DTO in its body.
  - the `ccStatus` contains a CCError object that itself provides
    - `statusCode` a Integer code referring to the specific error that occurred
    - `details` a pre-defined String generally explaining the statusCode
    - `message` a case specific String explaing what exactly caused the error
  - the `data` is optional and only existent if the statusCode is 1000 (ok)

## CC Status System

### Endpoint structure
- Every Endpoint should try/catch for a CCException and call the Repository function inside
  ```java
  Something result;
  try{
      result = somethingRepository.getById(id);
  }catch (CCException ex){
      return CCResponse.error(ex);
  }
  return CCResponse.ok(result);
  ```
- Wherever a error occurs in the Repository a CCException should be thrown
  ```java
  throw new CCException(statusCode);
  throw new CCException(statusCode, "custom error message")
  ```

### Accepted Status Codes
- 1000: All good
- 1100: **Structure error**: Problems with the general request structure / syntax
- 1101: Invalid id in getter
- 1102: Invalid id in setter
- 1103: Missing required argument in url
- 1104: Invalid argument structure/syntax/type in url
- 1105: Missing required data in body
- 1106: Invalid data structure/syntax/type in body
- 1106: Invalid URL provided
- 1200: **Task was not performed**: The data provided was structurally / syntactically correct but the requested action cant be performed.
- 1201: Duplicate request
- 1202: The data provided to the endpoint returned no results
- 1203: File is empty
- 1204: File has Invalid Structure
- 1205: Operation was not allowed
