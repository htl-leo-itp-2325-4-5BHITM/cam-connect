/*INSERT INTO student (student_id, firstname, lastname, password, school_class, username)
VALUES (NEXT VALUE FOR student_seq, 'Michael', 'Leisch', 'passwort1', '4BHITM', 'IT200269');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username)
VALUES (NEXT VALUE FOR student_seq, 'Yanik', 'Kendler', 'passwort1', '4BHITM', 'IT200272');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username)
VALUES (NEXT VALUE FOR student_seq, 'Leon', 'Steinhuber', 'passwort1', '4BHITM', 'IT200280');
INSERT INTO student (student_id, firstname, lastname, password, school_class, username)
VALUES (NEXT VALUE FOR student_seq, 'Julian', 'Jaklitsch', 'passwort1', '4BHITM', 'IT190208');

INSERT INTO Teacher (teacher_id, firstname, lastname, password, username)
VALUES (NEXT VALUE FOR teacher_seq, 'Professor', 'Johnson', 'teacherpass', 'prof_johnson');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username)
VALUES (NEXT VALUE FOR teacher_seq, 'Dr.', 'Williams', 'pass123', 'dr_williams');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username)
VALUES (NEXT VALUE FOR teacher_seq, 'Ms.', 'Smith', 'teacherpass', 'ms_smith');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username)
VALUES (NEXT VALUE FOR teacher_seq, 'Mr.', 'Jones', 'pass123', 'mr_jones');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username)
VALUES (NEXT VALUE FOR teacher_seq, 'Dr.', 'Miller', 'teacherpass', 'dr_miller');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username)
VALUES (NEXT VALUE FOR teacher_seq, 'Mrs.', 'Brown', 'pass123', 'mrs_brown');*/

insert into tag (tag_id, name, description)
values (NEXT VALUE FOR tag_seq, 'Foto', 'Dieses Gerät ist am besten für Fotografie geeignet');
insert into tag (tag_id, name, description)
values (NEXT VALUE FOR tag_seq, 'Video', 'Dieses Gerät ist am besten fürs filmen von Videos geeignet');
insert into tag (tag_id, name, description)
values (NEXT VALUE FOR tag_seq, 'Makro', 'Dieses Gerät ist spezifisch für Makrofotografie gedacht');

/*

-- Insert sample data for LensMount
INSERT INTO LensMount (mount_id, name) VALUES
                                           (NEXT VALUE FOR lensmount_seq, 'Canon EF'),
                                           (NEXT VALUE FOR lens_seq, 'Nikon F'),
                                           (NEXT VALUE FOR lens_seq, 'Sony E');
-- Add more LensMount records as needed

-- Insert sample data for CameraSensor
INSERT INTO CameraSensor (sensor_id, name) VALUES
                                               (1, 'Full Frame'),
                                               (2, 'APS-C'),
                                               (3, 'Micro Four Thirds'),
                                               (4, '1-inch');
-- Add more CameraSensor records as needed

-- Insert sample data for TripodHead
INSERT INTO TripodHead (head_id, name) VALUES
                                           (3, 'Gimbal Head'),
                                           (4, 'Fluid Head');
-- Add more TripodHead records as needed

-- Insert sample data for CameraResolution
INSERT INTO CameraResolution (resolution_id, name, details) VALUES
                                                                (1, 'HD', '1920x1080'),
                                                                (2, '4K UHD', '3840x2160'),
                                                                (3, '5K', '5120x2880'),
                                                                (4, '6K', '6144x3456');
-- Add more CameraResolution records as needed

-- Insert sample data for DeviceType
INSERT INTO DeviceType (type_id, name) VALUES
                                                  (1, 'Camera'),
                                                  (2, 'Drone'),
                                                  (3, 'Audio Device'),
                                                  (4, 'Light'),
                                                  (5, 'Tripod'),
                                                  (6, 'Stabilizer'),
                                                  (7, 'Lens');
-- Add more DeviceType records as needed

-- Insert sample data for LightType
INSERT INTO LightType (type_id, watts, rgb, variable_temperature) VALUES
                                                                      (4, 100, true, false),
                                                                      (5, 200, false, true);
-- Add more LightType records as needed

-- Insert sample data for StabilizerType
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis) VALUES
                                                                     (6, 5, 3),
                                                                     (7, 8, 4);
-- Add more StabilizerType records as needed

-- Insert sample data for DroneType
INSERT INTO DroneType (type_id, sensor_id, resolution_video_id, resolution_foto_id, max_range) VALUES
                                                                                                   (2, 1, 1, 2, 500),
                                                                                                   (7, 2, 3, 4, 1000);
-- Add more DroneType records as needed

-- Insert sample data for LensType
INSERT INTO LensType (type_id, f_stop, mount_id, focal_length) VALUES
                                                                   (7, 2.8, 1, 50),
                                                                   (8, 1.4, 2, 85);
-- Add more LensType records as needed

-- Insert sample data for AudioType
INSERT INTO AudioType (type_id, windblocker, wireless, needs_recorder) VALUES
                                                                           (3, true, false, true),
                                                                           (4, false, true, false);
-- Add more AudioType records as needed

-- Insert sample data for TripodType
INSERT INTO TripodType (type_id, height, head_id) VALUES
                                                      (5, 150, 1),
                                                      (6, 180, 2);
-- Add more TripodType records as needed

-- Insert sample data for Tag
INSERT INTO Tag (tag_id, type_ids, name, description) VALUES
                                                          (1, [1, 2, 7], 'Photography', 'Devices for photography enthusiasts'),
                                                          (2, [3, 6], 'Audio Recording', 'Devices for audio recording');
-- Add more Tag records as needed

-- Insert sample data for Device
INSERT INTO Device (device_id, number, serial, note, type_id) VALUES
                                                                  (1, 101, 'SN123456', 'Good condition', 1),
                                                                  (2, 102, 'SN789012', 'Needs maintenance', 3);
-- Add more Device records as needed

-- Insert sample data for Rent
INSERT INTO Rent (rent_id, student_id, device_id, teacher_id_start, teacher_id_end, rent_start, rent_end_planned, rent_end_actual, status) VALUES
                                                                                                                                               (1, 1, 1, 1, 2, '2023-01-01', '2023-01-15', '2023-01-15', 'confirmed'),
                                                                                                                                               (2, 2, 2, 2, 1, '2023-02-01', '2023-02-10', '2023-02-10', 'confirmed');
-- Add more Rent records as needed

-- Insert sample data for Student
INSERT INTO Student (student_id, firstname, lastname, school_class, email, password, username) VALUES
                                                                                                   (1, 'John', 'Doe', '10A', 'john.doe@example.com', 'password123', 'john_doe'),
                                                                                                   (2, 'Jane', 'Smith', '11B', 'jane.smith@example.com', 'securepass', 'jane_smith');
-- Add more Student records as needed

-- Insert sample data for Teacher
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES
                                                                              (1, 'Professor', 'Johnson', 'teacherpass', 'prof_johnson'),
                                                                              (2, 'Dr.', 'Williams', 'pass123', 'dr_williams');
-- Add more Teacher records as needed

-- Insert sample data for DeviceSet
INSERT INTO DeviceSet (set_id, name, device_types) VALUES
                                                       (1, 'Photography Kit', [1, 2, 7]),
                                                       (2, 'Audio Recording Set', [3, 6]);
-- Add more DeviceSet records as needed

-- Test Inserts for LensMount
*/
-- Assuming you have sequences named accordingly (e.g., lens_mount_seq, camera_sensor_seq, etc.)
-- Create sequences: CREATE SEQUENCE lens_mount_seq, camera_sensor_seq, tripod_head_seq, ...

/*

-- Create sequences for LensMount
CREATE SEQUENCE lens_mount_seq START WITH 1 INCREMENT BY 1;

-- Create sequences for CameraSensor
CREATE SEQUENCE camera_sensor_seq START WITH 1 INCREMENT BY 1;

-- Create sequences for TripodHead
CREATE SEQUENCE tripod_head_seq START WITH 1 INCREMENT BY 1;

-- Create sequences for CameraResolution
CREATE SEQUENCE camera_resolution_seq START WITH 1 INCREMENT BY 1;

-- Create sequences for DeviceType
CREATE SEQUENCE device_type_seq START WITH 1 INCREMENT BY 1;

-- Create sequences for LightType
CREATE SEQUENCE light_type_seq START WITH 1 INCREMENT BY 1;

-- Create sequences for StabilizerType
CREATE SEQUENCE stabilizer_type_seq START WITH 1 INCREMENT BY 1;

-- Create sequences for DroneType
CREATE SEQUENCE drone_type_seq START WITH 1 INCREMENT BY 1;

-- Create sequences for LensType
CREATE SEQUENCE lens_type_seq START WITH 1 INCREMENT BY 1;

-- Create sequences for AudioType
CREATE SEQUENCE audio_type_seq START WITH 1 INCREMENT BY 1;

-- Create sequences for TripodType
CREATE SEQUENCE tripod_type_seq START WITH 1 INCREMENT BY 1;

-- Create sequences for Tag
CREATE SEQUENCE tag_seq START WITH 1 INCREMENT BY 1;

*/
-- Test Inserts for LensMount
INSERT INTO LensMount (mount_id, name)
VALUES (NEXT VALUE FOR lens_mount_seq, 'Canon EF');
INSERT INTO LensMount (mount_id, name)
VALUES (NEXT VALUE FOR lens_mount_seq, 'Nikon F');
INSERT INTO LensMount (mount_id, name)
VALUES (NEXT VALUE FOR lens_mount_seq, 'Sony E');
INSERT INTO LensMount (mount_id, name)
VALUES (NEXT VALUE FOR lens_mount_seq, 'Pentax K');
INSERT INTO LensMount (mount_id, name)
VALUES (NEXT VALUE FOR lens_mount_seq, 'Fujifilm X');
INSERT INTO LensMount (mount_id, name)
VALUES (NEXT VALUE FOR lens_mount_seq, 'Olympus/Panasonic Micro Four Thirds');

-- Test Inserts for CameraSensor
INSERT INTO CameraSensor (sensor_id, name)
VALUES (NEXT VALUE FOR camera_sensor_seq, 'Full Frame');
INSERT INTO CameraSensor (sensor_id, name)
VALUES (NEXT VALUE FOR camera_sensor_seq, 'APS-C');
INSERT INTO CameraSensor (sensor_id, name)
VALUES (NEXT VALUE FOR camera_sensor_seq, 'Micro Four Thirds');
INSERT INTO CameraSensor (sensor_id, name)
VALUES (NEXT VALUE FOR camera_sensor_seq, 'Medium Format');
INSERT INTO CameraSensor (sensor_id, name)
VALUES (NEXT VALUE FOR camera_sensor_seq, '1-inch');
INSERT INTO CameraSensor (sensor_id, name)
VALUES (NEXT VALUE FOR camera_sensor_seq, 'Four Thirds');

-- Test Inserts for TripodHead
INSERT INTO TripodHead (head_id, name)
VALUES (NEXT VALUE FOR tripod_head_seq, 'Ball Head');
INSERT INTO TripodHead (head_id, name)
VALUES (NEXT VALUE FOR tripod_head_seq, 'Pan-and-Tilt Head');
INSERT INTO TripodHead (head_id, name)
VALUES (NEXT VALUE FOR tripod_head_seq, 'Gimbal Head');
INSERT INTO TripodHead (head_id, name)
VALUES (NEXT VALUE FOR tripod_head_seq, 'Fluid Head');
INSERT INTO TripodHead (head_id, name)
VALUES (NEXT VALUE FOR tripod_head_seq, 'Three-Way Pan Head');
INSERT INTO TripodHead (head_id, name)
VALUES (NEXT VALUE FOR tripod_head_seq, 'Geared Head');

-- Test Inserts for CameraResolution
INSERT INTO CameraResolution (resolution_id, name, details)
VALUES (NEXT VALUE FOR camera_resolution_seq, 'HD', '1920x1080');
INSERT INTO CameraResolution (resolution_id, name, details)
VALUES (NEXT VALUE FOR camera_resolution_seq, '4K UHD', '3840x2160');
INSERT INTO CameraResolution (resolution_id, name, details)
VALUES (NEXT VALUE FOR camera_resolution_seq, '5K', '5120x2880');
INSERT INTO CameraResolution (resolution_id, name, details)
VALUES (NEXT VALUE FOR camera_resolution_seq, '6K', '6144x3456');
INSERT INTO CameraResolution (resolution_id, name, details)
VALUES (NEXT VALUE FOR camera_resolution_seq, '8K', '7680x4320');
INSERT INTO CameraResolution (resolution_id, name, details)
VALUES (NEXT VALUE FOR camera_resolution_seq, '12K', '12288x6912');

--TODO this is not how the table structure for DeviceType works:
-- if you insert one via the API you will see that the DeviceType contains only the names for the devices
-- the sub tables reference the original entry and store more detailed information
-- I rewrote the next 2 blocks to insert light types

-- Test Inserts for DeviceType
INSERT INTO DeviceType (type_id, name)
VALUES (NEXT VALUE FOR device_type_seq, 'Aputure');
INSERT INTO DeviceType (type_id, name)
VALUES (NEXT VALUE FOR device_type_seq, 'Baustellen Lampe');
INSERT INTO DeviceType (type_id, name)
VALUES (NEXT VALUE FOR device_type_seq, 'LED panel');
INSERT INTO DeviceType (type_id, name)
VALUES (NEXT VALUE FOR device_type_seq, 'Flash');
INSERT INTO DeviceType (type_id, name)
VALUES (NEXT VALUE FOR device_type_seq, 'Smallrig');
INSERT INTO DeviceType (type_id, name)
VALUES (NEXT VALUE FOR device_type_seq, 'Neewer');

-- Test Inserts for LightType
INSERT INTO LightType (type_id, watts, rgb, variable_temperature)
VALUES (1, 100, true, false);
INSERT INTO LightType (type_id, watts, rgb, variable_temperature)
VALUES (2, 200, false, true);
INSERT INTO LightType (type_id, watts, rgb, variable_temperature)
VALUES (3, 50, true, true);
INSERT INTO LightType (type_id, watts, rgb, variable_temperature)
VALUES (4, 150, true, false);
INSERT INTO LightType (type_id, watts, rgb, variable_temperature)
VALUES (5, 120, false, true);
INSERT INTO LightType (type_id, watts, rgb, variable_temperature)
VALUES (6, 75, true, true);

-- Test Inserts for StabilizerType
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis)
VALUES (1, 5, 3);
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis)
VALUES (2, 8, 4);
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis)
VALUES (3, 10, 2);
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis)
VALUES (4, 15, 3);
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis)
VALUES (5, 20, 4);
INSERT INTO StabilizerType (type_id, max_weight, number_of_axis)
VALUES (6, 25, 5);

-- Test Inserts for DroneType
INSERT INTO DroneType (type_id, sensor_id, resolution_id, max_range)
VALUES (1, 1, 1, 500);
INSERT INTO DroneType (type_id, sensor_id, resolution_id, max_range)
VALUES (2, 2, 3, 1000);
INSERT INTO DroneType (type_id, sensor_id, resolution_id,  max_range)
VALUES (3, 3, 5, 1500);

-- Test Inserts for LensType
INSERT INTO LensType (type_id, f_stop, mount_id, focal_length)
VALUES (1, 2.8, 1, 50);
INSERT INTO LensType (type_id, f_stop, mount_id, focal_length)
VALUES (2, 1.4, 2, 85);
INSERT INTO LensType (type_id, f_stop, mount_id, focal_length)
VALUES (3, 2, 3, 35);


-- Test Inserts for AudioType
INSERT INTO AudioType (type_id, windblocker, wireless, needsrecorder)
VALUES (1, true, false, true);
INSERT INTO AudioType (type_id, windblocker, wireless, needsrecorder)
VALUES (2, false, true, false);
INSERT INTO AudioType (type_id, windblocker, wireless, needsrecorder)
VALUES (3, true, true, true);


-- Test Inserts for TripodType
INSERT INTO TripodType (type_id, height, head_id)
VALUES (1, 150, 1);
INSERT INTO TripodType (type_id, height, head_id)
VALUES (2, 180, 2);
INSERT INTO TripodType (type_id, height, head_id)
VALUES (3, 120, 3);


-- Test Inserts for Tag
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

