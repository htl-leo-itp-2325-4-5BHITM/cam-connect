# CamConnect API Doku

- `routename/{pathparam}: {jsonkey, ?optional_jsonkey} -> ReturnValue`
- `iamnotavalidroute -x`
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
│   ├── create : {count} -> [Device]
│   ├── getall -> [Device]
│   └── getbyid/{rent_id}
│       ├── remove
│       └── update : {number, serial, note}
│           ├── number : {value}
│           ├── serial : {value}
│           ├── note : {value}
│           └── type: {value}
├── devicetype -x
│   ├── create -x
│   │   ├── lens : {f_stop, mount_id, focal_length}
│   │   ├── camera : {sensor_id, resolution_id, mount_id}
│   │   ├── drone : {sensor_id, resolution_id, max_range
│   │   ├── audio : {windblocker, wireless, needs-recorder}
│   │   ├── light : {watts, rbg, variable_temperatur}
│   │   ├── tripod : {height, head_id}
│   │   └── stabilizer : {max_weight, number_of_axis}
│   └── getbyid/{type_id} -> DeviceType
│       ├── remove
│       └── update : {number, serial, note}
│           ├── lens : {f_stop, mount_id, focal_length}
│           ├── camera : {sensor_id, resolution_id, mount_id}
│           ├── drone : {sensor_id, resolution_id, max_range
│           ├── audio : {windblocker, wireless, needs-recorder}
│           ├── light : {watts, rbg, variable_temperatur}
│           ├── tripod : {height, head_id}
│           └── stabilizer : {max_weight, number_of_axis}
├── student -x
└── teacher -x
```

## Response Structure

- Every Endpoint returns a Response object with standard http Status code to indicate the general status of the request.
- If a request goes through but is faulty the http status is 400 or a fitting 4xx [error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
  - Instead of the requested entity, a CCError should be returned
  - `return Response.status(400).entity(CCError.create(1xxx)).build()`

### CC Error Codes

- 1000: All good
- 1001: Something went wrong but an invalid error code was provided
- 1100: **Structure error**: Problems with the general request structure / syntax
- 1101: Invalid id in getter
- 1102: Invalid id in setter
- 1103: Missing required argument in url
- 1104: Invalid argument structure/syntax/type in url
- 1105: Missing required data in body
- 1106: Invalid data structure/syntax/type in body
- 1200: **Task was not performed**: The data provided was structurally / syntactically correct but the requested action cant be performed.
- 1201: Duplicate request