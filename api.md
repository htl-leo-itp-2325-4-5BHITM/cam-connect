api/
  rent/
    create -> Rent
    getall -> [Rent]
    getbyid/{rent_id}/ -> Rent
      remove
      update/ {student_id, device_id, teacher_id_start, teacher_id_end, rent_start, rent_end_planned, rend_end_actual, note, status}
        student {value}
        device {value}
        teacherstart {value}
        teacherend {value}
        rentstart {value}
        rentendplanned {value}
        rentendactual {value}
        note {value}
        status {value}
  device
    create {count} -> [Device]
    getall -> [Device]
    getbyid/{rent_id}/
      remove
      update/ {number, serial, note}
        number {value}
        serial {value}
        note {value}
  devicetype
    create -|
      lens {
      camera
      drone
      audio
      light
      tripod
      stabilizer
  student
  teacher