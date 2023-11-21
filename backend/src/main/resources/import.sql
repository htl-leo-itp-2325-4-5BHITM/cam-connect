-- Insert sample data for LensMount
INSERT INTO LensMount (mount_id, name) VALUES
                                           (1, 'Canon EF'),
                                           (2, 'Nikon F'),
                                           (3, 'Sony E');
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
INSERT INTO DeviceType (type_id, name, image) VALUES
                                                  (1, 'Camera', 'camera_image.jpg'),
                                                  (2, 'Drone', 'drone_image.jpg'),
                                                  (3, 'Audio Device', 'audio_image.jpg'),
                                                  (4, 'Light', 'light_image.jpg'),
                                                  (5, 'Tripod', 'tripod_image.jpg'),
                                                  (6, 'Stabilizer', 'stabilizer_image.jpg'),
                                                  (7, 'Lens', 'lens_image.jpg');
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
