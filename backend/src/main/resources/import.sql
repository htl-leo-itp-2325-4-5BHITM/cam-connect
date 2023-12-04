/*INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Anna', 'Schmidt', 'passwort1', '1CHITM', 'IT200271');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Lukas', 'Müller', 'passwort2', '2AHITM', 'IT200272');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Sophie', 'Wagner', 'passwort3', '3BHITM', 'IT200273');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Max', 'Hofmann', 'passwort4', '4CHITM', 'IT200274');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Emma', 'Klein', 'passwort5', '5AHITM', 'IT200275');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Leon', 'Schulz', 'passwort6', '1BHITM', 'IT200276');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Mia', 'Herrmann', 'passwort7', '2CHITM', 'IT200277');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Tim', 'Becker', 'passwort8', '3AHITM', 'IT200278');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Lena', 'Schneider', 'passwort9', '4CHITM', 'IT200279');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Finn', 'Koch', 'passwort10', '5BHITM', 'IT200280');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Laura', 'Bauer', 'passwort11', '1AHITM', 'IT200281');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Elias', 'Schuster', 'passwort12', '2BHITM', 'IT200282');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Hannah', 'Wolf', 'passwort13', '3CHITM', 'IT200283');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Paul', 'Lange', 'passwort14', '4AHITM', 'IT200284');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username) VALUES (NEXT VALUE FOR student_seq, 'Clara', 'Graf', 'passwort15', '5CHITM', 'IT200285');*/


/*INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES(NEXT VALUE FOR teacher_seq, 'Professor', 'Johnson', 'teacherpass', 'prof_johnson');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES(NEXT VALUE FOR teacher_seq, 'Dr.', 'Williams', 'pass123', 'dr_williams');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES(NEXT VALUE FOR teacher_seq, 'Ms.', 'Smith', 'teacherpass', 'ms_smith');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES(NEXT VALUE FOR teacher_seq, 'Mr.', 'Jones', 'pass123', 'mr_jones');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES(NEXT VALUE FOR teacher_seq, 'Dr.', 'Miller', 'teacherpass', 'dr_miller');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES(NEXT VALUE FOR teacher_seq, 'Mrs.', 'Brown', 'pass123', 'mrs_brown');*/

insert into tag (tag_id, name, description) values (NEXT VALUE FOR tag_seq, 'Foto', 'Dieses Gerät ist am besten für Fotografie geeignet');
insert into tag (tag_id, name, description) values (NEXT VALUE FOR tag_seq, 'Video', 'Dieses Gerät ist am besten fürs filmen von Videos geeignet');
insert into tag (tag_id, name, description) values (NEXT VALUE FOR tag_seq, 'Makro', 'Dieses Gerät ist spezifisch für Makrofotografie gedacht');

/
-- Test Inserts for LensMount
INSERT INTO LensMount (mount_id, name) VALUES
                                           (NEXT VALUE FOR lens_mount_seq, 'Canon EF');
INSERT INTO LensMount (mount_id, name) VALUES
                                           (NEXT VALUE FOR lens_mount_seq, 'Nikon F');
INSERT INTO LensMount (mount_id, name) VALUES
                                           (NEXT VALUE FOR lens_mount_seq, 'Sony E');
INSERT INTO LensMount (mount_id, name) VALUES
                                           (NEXT VALUE FOR lens_mount_seq, 'Pentax K');
INSERT INTO LensMount (mount_id, name) VALUES
                                           (NEXT VALUE FOR lens_mount_seq, 'Fujifilm X');
INSERT INTO LensMount (mount_id, name) VALUES
                                           (NEXT VALUE FOR lens_mount_seq, 'Olympus/Panasonic Micro Four Thirds');

-- Test Inserts for CameraSensor
INSERT INTO CameraSensor (sensor_id, name) VALUES
                                               (NEXT VALUE FOR camera_sensor_seq, 'Full Frame');
INSERT INTO CameraSensor (sensor_id, name) VALUES
                                               (NEXT VALUE FOR camera_sensor_seq, 'APS-C');
INSERT INTO CameraSensor (sensor_id, name) VALUES
                                               (NEXT VALUE FOR camera_sensor_seq, 'Micro Four Thirds');
INSERT INTO CameraSensor (sensor_id, name) VALUES
                                               (NEXT VALUE FOR camera_sensor_seq, 'Medium Format');
INSERT INTO CameraSensor (sensor_id, name) VALUES
                                               (NEXT VALUE FOR camera_sensor_seq, '1-inch');
    INSERT INTO CameraSensor (sensor_id, name) VALUES
                                               (NEXT VALUE FOR camera_sensor_seq, 'Four Thirds');

-- Test Inserts for TripodHead
INSERT INTO TripodHead (head_id, name) VALUES
                                           (NEXT VALUE FOR tripod_head_seq, 'Ball Head');
INSERT INTO TripodHead (head_id, name) VALUES
                                           (NEXT VALUE FOR tripod_head_seq, 'Pan-and-Tilt Head');
INSERT INTO TripodHead (head_id, name) VALUES
                                           (NEXT VALUE FOR tripod_head_seq, 'Gimbal Head');
INSERT INTO TripodHead (head_id, name) VALUES
                                           (NEXT VALUE FOR tripod_head_seq, 'Fluid Head');
INSERT INTO TripodHead (head_id, name) VALUES
                                           (NEXT VALUE FOR tripod_head_seq, 'Three-Way Pan Head');
INSERT INTO TripodHead (head_id, name) VALUES
                                           (NEXT VALUE FOR tripod_head_seq, 'Geared Head');

-- Test Inserts for CameraResolution
INSERT INTO CameraResolution (resolution_id, name, details) VALUES(NEXT VALUE FOR camera_resolution_seq, 'HD', '1920x1080');
INSERT INTO CameraResolution (resolution_id, name, details) VALUES(NEXT VALUE FOR camera_resolution_seq, '4K UHD', '3840x2160');
INSERT INTO CameraResolution (resolution_id, name, details) VALUES(NEXT VALUE FOR camera_resolution_seq, '5K', '5120x2880');
INSERT INTO CameraResolution (resolution_id, name, details) VALUES(NEXT VALUE FOR camera_resolution_seq, '6K', '6144x3456');
INSERT INTO CameraResolution (resolution_id, name, details) VALUES(NEXT VALUE FOR camera_resolution_seq, '8K', '7680x4320');
INSERT INTO CameraResolution (resolution_id, name, details) VALUES(NEXT VALUE FOR camera_resolution_seq, '12K', '12288x6912');

--TODO this is not how the table structure for DeviceType works:
-- if you insert one via the API you will see that the DeviceType contains only the names for the devices
-- the sub tables reference the original entry and store more detailed information
-- I rewrote the next 2 blocks to insert light types

-- Test Inserts for DeviceType
INSERT INTO DeviceType (type_id, name) VALUES(NEXT VALUE FOR device_type_seq, 'Aputure',);
INSERT INTO DeviceType (type_id, name) VALUES(NEXT VALUE FOR device_type_seq, 'Baustellen Lampe');
INSERT INTO DeviceType (type_id, name) VALUES(NEXT VALUE FOR device_type_seq, 'LED panel');
INSERT INTO DeviceType (type_id, name) VALUES(NEXT VALUE FOR device_type_seq, 'Flash');
INSERT INTO DeviceType (type_id, name) VALUES(NEXT VALUE FOR device_type_seq, 'Smallrig');
INSERT INTO DeviceType (type_id, name) VALUES(NEXT VALUE FOR device_type_seq, 'Neewer');

-- Test Inserts for LightType
INSERT INTO LightType (type_id, watts, rgb, variable_temperature) VALUES(1, 100, true, false);
INSERT INTO LightType (type_id, watts, rgb, variable_temperature) VALUES(2, 200, false, true);
INSERT INTO LightType (type_id, watts, rgb, variable_temperature) VALUES(3, 50, true, true);
INSERT INTO LightType (type_id, watts, rgb, variable_temperature) VALUES(4, 150, true, false);
INSERT INTO LightType (type_id, watts, rgb, variable_temperature) VALUES(5, 120, false, true);
INSERT INTO LightType (type_id, watts, rgb, variable_temperature) VALUES(6, 75, true, true);

-- Test Inserts for StabilizerType
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis) VALUES
                                                                     (NEXT VALUE FOR device_type_seq, 5, 3);
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis) VALUES
                                                                     (NEXT VALUE FOR device_type_seq, 8, 4);
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis) VALUES
                                                                     (NEXT VALUE FOR device_type_seq, 10, 2);
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis) VALUES
                                                                     (NEXT VALUE FOR device_type_seq, 15, 3);
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis) VALUES
                                                                     (NEXT VALUE FOR device_type_seq, 20, 4);
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis) VALUES
                                                                     (NEXT VALUE FOR device_type_seq, 25, 5);

-- Test Inserts for DroneType
INSERT INTO DroneType (type_id, sensor_id, resolution_video_id, resolution_foto_id, max_range) VALUES
                                                                                                   (NEXT VALUE FOR device_type_seq, 1, 1, 2, 500);
INSERT INTO DroneType (type_id, sensor_id, resolution_video_id, resolution_foto_id, max_range) VALUES
                                                                                                   (NEXT VALUE FOR device_type_seq, 2, 3, 4, 1000);
INSERT INTO DroneType (type_id, sensor_id, resolution_video_id, resolution_foto_id, max_range) VALUES
                                                                                                   (NEXT VALUE FOR device_type_seq, 3, 5, 6, 1500);
INSERT INTO DroneType (type_id, sensor_id, resolution_video_id, resolution_foto_id, max_range) VALUES
                                                                                                   (NEXT VALUE FOR device_type_seq, 4, 7, 8, 2000);
INSERT INTO DroneType (type_id, sensor_id, resolution_video_id, resolution_foto_id, max_range) VALUES
                                                                                                   (NEXT VALUE FOR device_type_seq, 5, 9, 10, 2500);
INSERT INTO DroneType (type_id, sensor_id, resolution_video_id, resolution_foto_id, max_range) VALUES
                                                                                                   (NEXT VALUE FOR device_type_seq, 6, 11, 12, 3000);

-- Test Inserts for LensType
INSERT INTO LensType (type_id, f_stop, mount_id, focal_length) VALUES
                                                                   (NEXT VALUE FOR device_type_seq, 2.8, 1, 50);
INSERT INTO LensType (type_id, f_stop, mount_id, focal_length) VALUES
                                                                   (NEXT VALUE FOR device_type_seq, 1.4, 2, 85);
INSERT INTO LensType (type_id, f_stop, mount_id, focal_length) VALUES
                                                                   (NEXT VALUE FOR device_type_seq, 2, 3, 35);
INSERT INTO LensType (type_id, f_stop, mount_id, focal_length) VALUES
                                                                   (NEXT VALUE FOR device_type_seq, 4, 4, 200);
INSERT INTO LensType (type_id, f_stop, mount_id, focal_length) VALUES
                                                                   (NEXT VALUE FOR device_type_seq, 1.8, 5, 24);
INSERT INTO LensType (type_id, f_stop, mount_id, focal_length) VALUES
                                                                   (NEXT VALUE FOR device_type_seq, 3.5, 6, 100);

-- Test Inserts for AudioType
INSERT INTO AudioType (type_id, windblocker, wireless, needs_recorder) VALUES
                                                                           (NEXT VALUE FOR device_type_seq, true, false, true);
INSERT INTO AudioType (type_id, windblocker, wireless, needs_recorder) VALUES
                                                                           (NEXT VALUE FOR device_type_seq, false, true, false);
INSERT INTO AudioType (type_id, windblocker, wireless, needs_recorder) VALUES
                                                                           (NEXT VALUE FOR device_type_seq, true, true, true);
INSERT INTO AudioType (type_id, windblocker, wireless, needs_recorder) VALUES
                                                                           (NEXT VALUE FOR device_type_seq, false, false, true);
INSERT INTO AudioType (type_id, windblocker, wireless, needs_recorder) VALUES
                                                                           (NEXT VALUE FOR device_type_seq, true, true, false);
INSERT INTO AudioType (type_id, windblocker, wireless, needs_recorder) VALUES
                                                                           (NEXT VALUE FOR device_type_seq, false, true, true);

-- Test Inserts for TripodType
INSERT INTO TripodType (type_id, height, head_id) VALUES
                                                      (NEXT VALUE FOR device_type_seq, 150, 1);
INSERT INTO TripodType (type_id, height, head_id) VALUES
                                                      (NEXT VALUE FOR device_type_seq, 180, 2);
INSERT INTO TripodType (type_id, height, head_id) VALUES
                                                      (NEXT VALUE FOR device_type_seq, 120, 3);
INSERT INTO TripodType (type_id, height, head_id) VALUES
                                                      (NEXT VALUE FOR device_type_seq, 200, 4);
INSERT INTO TripodType (type_id, height, head_id) VALUES
                                                      (NEXT VALUE FOR device_type_seq, 160, 5);
INSERT INTO TripodType (type_id, height, head_id) VALUES
                                                      (NEXT VALUE FOR device_type_seq, 140, 6);

-- Test Inserts for Tag


INSERT INTO CameraType (sensor_id, resolution_id, mount_id, framerate, autofocus) VALUES
                                                                                      (1, 1, 1, 30, true);
INSERT INTO CameraType (sensor_id, resolution_id, mount_id, framerate, autofocus) VALUES
                                                                                      (2, 2, 2, 60, true);
INSERT INTO CameraType (sensor_id, resolution_id, mount_id, framerate, autofocus) VALUES
                                                                                      (3, 3, 3, 24, false);

-- Insert demo data for Device
INSERT INTO Device (device_id, number, type, serial, note) VALUES    (1, 'CAM001', 1, 'ABC123', 'Professional camera for photography');
INSERT INTO Device (device_id, number, type, serial, note) VALUES (2, 'CAM002', 1, 'XYZ789', 'Compact camera for vlogging');
INSERT INTO Device (device_id, number, type, serial, note) VALUES   (3, 'CAM003', 2, 'PQR456', 'Mirrorless camera for travel');

-- Insert demo data for DeviceSet
INSERT INTO DeviceSet (set_id, name) VALUES
                                         (1, 'Photography Set'),
                                         (2, 'Vlogging Set'),
                                         (3, 'Travel Set');

-- Insert demo data for DeviceSet_DeviceType (linking DeviceSet with DeviceType)
INSERT INTO DeviceSet_DeviceType (set_id, type_id) VALUES
                                                       (1, 1);
INSERT INTO DeviceSet_DeviceType (set_id, type_id) VALUES
                                                       (1, 2);
INSERT INTO DeviceSet_DeviceType (set_id, type_id) VALUES
                                                       (2, 1);
INSERT INTO DeviceSet_DeviceType (set_id, type_id) VALUES
                                                       (3, 2);

--TODO change to static ids "NEXT VALUE FOR device_type_seq" will break everything
/*
INSERT INTO Tag (tag_id, type_ids, name, description) VALUES
      (NEXT VALUE FOR tag_seq, [NEXT VALUE FOR device_type_seq, NEXT VALUE FOR device_type_seq, NEXT VALUE FOR device_type_seq], 'Photography', 'Devices for photography enthusiasts');
INSERT INTO Tag (tag_id, type_ids, name, description) VALUES
    (NEXT VALUE FOR tag_seq, [NEXT VALUE FOR device_type_seq, NEXT VALUE FOR device_type_seq, NEXT VALUE FOR device_type_seq], 'Stabilization', 'Devices for video stabilization');
INSERT INTO Tag (tag_id, type_ids, name, description) VALUES
    (NEXT VALUE FOR tag_seq, [NEXT VALUE FOR device_type_seq, NEXT VALUE FOR device_type_seq, NEXT VALUE FOR device_type_seq], 'Tripods', 'Devices for stable camera support');
INSERT INTO Tag (tag_id, type_ids, name, description) VALUES
    (NEXT VALUE FOR tag_seq, [NEXT VALUE FOR device_type_seq, NEXT VALUE FOR device_type_seq, NEXT VALUE FOR device_type_seq], 'Drones', 'Devices for aerial photography');
*/

-- Test Inserts for Device

