# CamConnect API Doku
- `routename/{pathparam}: {jsonkey, ?optional_jsonkey} -> ReturnValue`
- `iamnotavalidroute -x`
- `iamasocketendpoint ~>`

## Structure
```
api
├── auth -x
│   ├── login -> KeyCloakResponse
│   ├── validate
│   └── role -> UserRoleEnum
├── device -x
│   ├── create : DeviceDTO -> [Device]
│   ├── getall -> [Device]
│   ├── search: DeviceSearchDTO -> Device
│   ├── getbynumberandtype/{number}/{type_id: [0-9]+} -> Device
│   ├── validatenumberandtype/{number}/{type_id} -> boolean
│   ├── getbyid/{rent_id}
│   │   ├── remove
│   │   └── update : DeviceDTO -> Device
│   ├── importcsv : File
│   └── exportcsv : File -> File (no cc-response)
├── deviceset -x
│   ├── getall -> DeviceSet
│   ├── getallfull: DeviceTypeFilters -> DeviceSet
│   ├── create: DeviceSetDTO -> DeviceSet
│   └── getbyid/{rent_id}
│       ├── delete
│       ├── update : DeviceSetDTO -> DeviceSet
│       └── tag/{tagId}/toggle
├── devicetype -x
│   ├── getall -> [DeviceType]
│   ├── getallfull: DeviceTypeFilters -> [DeviceType]
│   ├── search: {searchTerm: string} -> [AutocompleteNumberOptionDTO<DeviceTypeMinimalDTO>]
│   ├── create/{type: DeviceTypeVariantEnum}: data -> DeviceType
│   ├── getbyid/{type_id} -> DeviceType
│   │   ├── remove
│   │   ├── update: DeviceTypeGlobalObjectsDTO -> DeviceType
│   │   └── tag/{tagId}/toggle
│   ├── exportcsv/{type}
│   ├── importcsv/{type}
│   ├── importcsv/{type}
│   └── attribute -x
│       ├── getall -> [DeviceTypeAttribute]
│       ├── create/{type}
│       └── getbyid/{attribute_id} -> DeviceTypeAttribute
│           ├── update: DeviceTypeAttributeDTO -> DeviceTypeAttribute
│           └── remove
├── rent -x
│   ├── getall: RentFilters -> [Rent]
│   ├── getallsinglelist -> [Rent]
│   ├── getbyidlist/{ids} -> [Rent]
│   ├── create: [CreateRentDTO] -> Rent
│   └── getbyid/{rent_id} -> Rent
│       ├── sendconfirmation
│       ├── verifyconfirmationcode/{code}
│       ├── externalconfirmordecline
│       ├── confirm
│       ├── decline
│       ├── return
│       ├── remove
│       ├── update : ?{Rent: student_id.. }
│       ├── update/{property} : {value}
│       ├── exportcsv -> File
│       └── importcsv: File
├── tag -x
│   ├── getall -> [Tag]
│   ├── search: {searchTerm} -> Tag
│   ├── create: Tag -> Tag
│   └── getbyid/{rent_id} -> Rent
│       ├── update
│       └── remove
├── user -x
│   ├── getbyid/{user_id} -> User
│   ├── getallstudents -> [User]
│   ├── searchforstudent: {searchTerm: string} -> [AutocompleteNumberOptionDTO<User>]
│   ├── getallteachers -> [User]
│   ├── searchforteacher: {searchTerm: string} -> [AutocompleteNumberOptionDTO<User>]
│   └── loadfromldap -> [User]
└── socket
    └── rents ~> "update"
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
- 1107: Invalid URL provided
- 1200: **Task was not performed**: The data provided was structurally / syntactically correct but the requested action cant be performed.
- 1201: Duplicate request
- 1202: The data provided to the endpoint returned no results
- 1203: File is empty
- 1204: File has Invalid Structure
- 1205: Operation was not allowed
- 1206: Invalid Data provided

**Note**
Sorry we did not know yet how to properly write an API so the default @GET @DELETE pattern was not followed.. sry