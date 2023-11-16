```
api
├── rent
│   ├── create -> Rent
│   ├── getall -> [Rent]
│   └── getbyid/{rent_id} -> Rent
│       ├── remove
│       └── update : {Rent: student_id..}
│           ├── student : {value}
│           ├── device : {value}
│           ├── teacherstart : {value}
│           ├── teacherend : {value}
│           ├── rentstart : {value}
│           ├── rentendplanned : {value}
│           ├── rentendactual : {value}
│           ├── note : {value}
│           └── status : {value}
├── device
│   ├── create : {count} -> [Device]
│   ├── getall -> [Device]
│   └── getbyid/{rent_id}
│       ├── remove
│       └── update/ : {number, serial, note}
│           ├── number : {value}
│           ├── serial : {value}
│           └── note : {value}
├── devicetype
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
├── student
└── teacher
```

<!--

https://tree.nathanfriend.io/

- api
  - rent
    - create -> Rent
    - getall -> [Rent]
    - getbyid/{rent_id} -> Rent
      - remove
      - update : {Rent: student_id..}
        - student : {value}
        - device : {value}
        - teacherstart : {value}
        - teacherend : {value}
        - rentstart : {value}
        - rentendplanned : {value}
        - rentendactual : {value}
        - note : {value}
        - status : {value}
  - device
    - create : {count} -> [Device]
    - getall -> [Device]
    - getbyid/{rent_id}
      - remove
      - update/ : {number, serial, note}
        - number : {value}
        - serial : {value}
        - note : {value}
  - devicetype
    - create -x
      - lens : {f_stop, mount_id, focal_length}
      - camera : {sensor_id, resolution_id, mount_id}
      - drone : {sensor_id, resolution_id, max_range
      - audio : {windblocker, wireless, needs-recorder}
      - light : {watts, rbg, variable_temperatur}
      - tripod : {height, head_id}
      - stabilizer : {max_weight, number_of_axis}
    - getbyid/{type_id} -> DeviceType
      - remove
      - update : {number, serial, note}
        - lens : {f_stop, mount_id, focal_length}
        - camera : {sensor_id, resolution_id, mount_id}
        - drone : {sensor_id, resolution_id, max_range
        - audio : {windblocker, wireless, needs-recorder}
        - light : {watts, rbg, variable_temperatur}
        - tripod : {height, head_id}
        - stabilizer : {max_weight, number_of_axis}
  - student
  - teacher 

-->