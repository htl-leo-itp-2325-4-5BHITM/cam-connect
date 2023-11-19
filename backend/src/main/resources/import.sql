-- Insert demo data for DeviceType
INSERT INTO DeviceType (type_id, typeName, tag_id) VALUES
                                                       (1, 'Camera', 101),
                                                       (2, 'Drone', 102),
                                                       (3, 'Lens', 103),
                                                       (4, 'Audio', 104),
                                                       (5, 'Light', 105),
                                                       (6, 'Tripod', 106),
                                                       (7, 'Stabilizer', 107);

-- Insert demo data for CameraType
INSERT INTO CameraType (sensor, mount, resolution) VALUES
                                                       ('Full Frame', 'Tripod Mount', '4K'),
                                                       ('APS-C', 'Handheld Mount', '1080p'),
                                                       ('Micro Four Thirds', 'Studio Mount', '6K');

-- Insert demo data for DroneType
INSERT INTO DroneType (sensor, resolution, maxRange) VALUES
                                                         ('HD Camera', '720p', 500),
                                                         ('4K Camera', '4K', 1000),
                                                         ('6K Camera', '6K', 1500);

-- Insert demo data for LensType
INSERT INTO LensType (f-stop, mount, focalLength) VALUES
                                                      ('f/2.8', 'Canon EF', '50mm'),
                                                      ('f/1.4', 'Nikon F', '85mm'),
                                                      ('f/4.0', 'Sony E', '24-70mm');

-- Insert demo data for AudioType
INSERT INTO AudioType (windblocker, wireless, needsRecorder) VALUES
                                                                 (true, true, false),
                                                                 (false, true, true),
                                                                 (true, false, true);

-- Insert demo data for LightType
INSERT INTO LightType (watts, RGB, variableTemperature) VALUES
                                                            (100, true, true),
                                                            (50, false, true),
                                                            (200, true, false);

-- Insert demo data for TripodType
INSERT INTO TripodType (height, head) VALUES
                                          ('60 inches', 'Ball Head'),
                                          ('75 inches', 'Pan-and-Tilt Head'),
                                          ('50 inches', 'Fluid Head');

-- Insert demo data for StabilizerType
INSERT INTO StabilizerType (maxWeight, numberOfAxis) VALUES
                                                         (2, 3),
                                                         (5, 2),
                                                         (8, 4);

-- Insert demo data for Device
INSERT INTO Device (device_id, serial, note) VALUES
                                                 (1, 'ABC123', 'Used in the photography class'),
                                                 (2, 'XYZ789', 'For outdoor video shooting'),
                                                 (3, 'PQR456', 'Studio recording equipment');

-- Insert demo data for Rent
INSERT INTO Rent (rent_id, student_id, device_id, teacher_id, rent_start, rent_end_planned, rent_end_actual, status_rent_start, status_rent_end) VALUES
                                                                                                                                                     (1, 101, 1, 201, '2023-01-01', '2023-01-15', '2023-01-14', true, true),
                                                                                                                                                     (2, 102, 3, 202, '2023-02-01', '2023-02-10', NULL, true, false),
                                                                                                                                                     (3, 103, 5, 203, '2023-03-01', '2023-03-15', NULL, true, false);

-- Insert demo data for Favorite
INSERT INTO Favorite (fav_id, device_id, student_id) VALUES
                                                         (1, 1, 101),
                                                         (2, 3, 102),
                                                         (3, 5, 103);

-- Insert demo data for Tag
INSERT INTO Tag (tag_id, type_id, description) VALUES
                                                   (101, 1, 'Photography'),
                                                   (102, 2, 'Aerial'),
                                                   (103, 3, 'Portrait'),
                                                   (104, 4, 'Recording'),
                                                   (105, 5, 'Studio'),
                                                   (106, 6, 'Support');

-- Insert demo data for Student
INSERT INTO Student (student_id, firstname, lastname, school_class, password, user_id) VALUES
                                                                                           (101, 'John', 'Doe', 'Photography 101', 'password123', 301),
                                                                                           (102, 'Jane', 'Smith', 'Media Arts', 'pass456', 302),
                                                                                           (103, 'Bob', 'Johnson', 'Sound Engineering', 'secure789', 303);

-- Insert demo data for Teacher
INSERT INTO Teacher (teacher_id, firstname, lastname, verification, password, user_id) VALUES
                                                                                           (201, 'Professor', 'Smith', 'Verified', 'profpass123', 401),
                                                                                           (202, 'Dr.', 'Jones', 'Verified', 'drjones456', 402),
                                                                                           (203, 'Ms.', 'Williams', 'Verified', 'mswilliams789', 403);
