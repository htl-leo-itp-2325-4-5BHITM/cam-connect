-- Camera Systems
insert into devicetypeattribute(dtype, name, details) values ('CameraSystem', 'Spiegelreflex', 'DSLR mit physischem beweglichem Spiegel');
insert into devicetypeattribute(dtype, name, details) values ('CameraSystem', 'Systemkamera', 'DSLM, spiegellose Digitalkamera');

-- Camera Resolutions
insert into devicetypeattribute(dtype, name, resolution, details) values ('CameraResolution', '4k', '3840 x 2160', 'Sehr cool aber große filesize');
insert into devicetypeattribute(dtype, name, resolution, details) values ('CameraResolution', '1080p', '1920 x 1080', 'Standard High Definition resolution');
insert into devicetypeattribute(dtype, name, resolution, details) values ('CameraResolution', '720p', '1280 x 720', 'Standard High Definition resolution');

-- Camera Sensors
insert into devicetypeattribute(dtype, name, details, size) values ('CameraSensor', 'Full Frame', 'crazy', 'iwie x * y millimeter');
insert into devicetypeattribute(dtype, name, details, size) values ('CameraSensor', 'Micro Four Thirds', 'cool', ' iwie x * y millimeter');
insert into devicetypeattribute(dtype, name, details, size) values ('CameraSensor', 'APS-C', 'Good balance of size and quality', 'iwie x * y millimeter');
insert into devicetypeattribute(dtype, name, details, size) values ('CameraSensor', 'Medium Format', 'Larger sensor for higher image quality', 'iwie x * y millimeter');

-- Lens Mounts
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'Canon RF', 'Used by Canon mirrorless cameras');
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'Nikon Z', 'Used by Nikon mirrorless cameras');
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'L-Mount', 'Wird benutzt von Lumix, Leica und Blackmagic. Geignet für alle sensor größen bis inklusive full frame');
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'Micro Four Thirds', 'Für den micro four thirds sensor');

-- Tripod Heads
insert into devicetypeattribute(dtype, name, details) values ('TripodHead', '2 axis', '2 achsen ajustierbar');
insert into devicetypeattribute(dtype, name, details) values ('TripodHead', '3 axis', '3 achsen ajustierbar');
insert into devicetypeattribute(dtype, name, details) values ('TripodHead', 'Ballhead', 'In alle richtungen adjustierbarer Kugelkopf');

INSERT INTO tag (name, description)
VALUES
    ('Foto', 'Dieses Gerät ist am besten für Fotografie geeignet'),
    ('Video', 'Dieses Gerät ist am besten fürs filmen von Videos geeignet'),
    ('Makro', 'Dieses Gerät ist spezifisch für Makrofotografie gedacht');

/*
 * DEMO CONTENT STARTS HERE
 * everything above this line are inserts that we probably want to keep permanently as default values
 * everything below here are inserts that we throw away when going into production since they are purely for testing purposes
 * TODO take a look at the default values again, there has to be a better way to do this then through sql (could result in duplicates, is not very readable)
*/

-- Camera Types
insert into DEVICETYPE (variant, dtype, name, status, system_id, resolution_id, sensor_id, mount_id, autofocus)
values
    ('camera', 'CameraType', 'Sony A7 III', 'active', 1, 3, 4, 8, true),
    ('camera', 'CameraType', 'Canon EOS R5', 'active', 1, 4, 5, 9, true),
    ('camera', 'CameraType', 'Lumix S5 ii', 'active', 2, 3, 4, 6, true),
    ('camera', 'CameraType', 'Lumix GH6', 'active', 2, 3, 5, 7, true);

-- Simple Types
insert into DEVICETYPE (variant, dtype, name, description, status)
values
    ('simple', 'SimpleType', 'Kabel', '3 Meter Kabel', 'active'),
    ('simple', 'SimpleType', 'Superkabel', '5 Meter Kabel', 'active');

-- Drone Types
insert into DEVICETYPE (variant, dtype, name, sensor_id, resolution_id, max_range_kilometers, flight_time_minutes, status)
values
    ('drone', 'DroneType', 'Mavic Mini', 5, 4, 10, 50, 'active'),
    ('drone', 'DroneType', 'Mavic Pro', 6, 3, 10, 50, 'active');

-- Lens Types
insert into DEVICETYPE (variant, dtype, name, mount_id, f_stop, focal_length, status)
values
    ('lens', 'LensType', 'Lens 1', 10, 2.8, 35, 'active'),
    ('lens', 'LensType', 'Lens 2', 11, 3.8, 25, 'active'),
    ('lens', 'LensType', 'Lens 3', 12, 4.0, 45, 'active');

-- Light Types
insert into DEVICETYPE (variant, dtype, name, watts, rgb, variable_temperature, status)
values
    ('light', 'LightType', 'LED', 600, true, true, 'active'),
    ('light', 'LightType', 'Lampenstativ', 525, false, true, 'active');

-- Microphone Types
insert into DEVICETYPE (variant, dtype, name, windblocker, wireless, needs_recorder, status)
values
    ('microphone', 'MicrophoneType', 'Zoom H2', false, true, false, 'active'),
    ('microphone', 'MicrophoneType', 'RodeFunkset', true, true, true, 'active'),
    ('microphone', 'MicrophoneType', 'X-Vive Funks.', true, true, false, 'active');

-- Stabilizer Types
insert into DEVICETYPE (variant, dtype, name, max_weight_kilograms, number_of_axis, status)
values ('stabilizer', 'StabilizerType', 'Schulterrig', 200, 2, 'active'),
       ('stabilizer', 'StabilizerType', 'Gopro Gimbal', 150, 3, 'active');

-- assigning tags to devicetypes
INSERT INTO tag_devicetype (tag_tag_id, types_type_id)
VALUES
    (1, 1),  -- Tag 'Foto' associated with DeviceType 1
    (2, 2);  -- Tag 'Video' associated with DeviceType 2

-- Devices
insert into device (type_id, note, number, serial) values
    (1, '', 'A01', '141592653589793'),
    (1, '', 'A02', '238462643383279'),
    (2, '', 'B01', '419715028869399'),
    (3, '', 'C01', '314159265358979'),
    (4, '', 'D01', '271828182845904'),
    (2, '', 'B02', '323846264338327'),
    (1, '', 'A03', '589793238462643'),
    (2, 'Backup camera', 'B03', '846264338327950'),
    (3, 'Professional use', 'C02', '643383279502884'),
    (4, 'Travel photography', 'D02', '795028841971520'),
    (2, 'Secondary camera', 'B04', '582097494459230'),
    (3, 'Studio setup', 'C03', '781640628620899'),
    (4, 'Wildlife photography', 'D03', '862803482534211');

-- User inserts will break when moving to different user system
-- Students
INSERT INTO student (email, firstname, lastname, password, school_class, username)
VALUES
    ('m.leisch@students.htl-leonding.ac.at', 'Michael', 'Leisch', 'michiiii', '4BHITM', 'michiii'),
    ('y.kendler@students.htl-leonding.ac.at', 'Yanik', 'Kendler', 'yanuki', '4BHITM', 'yanuki'),
    ('j.jaklitsch@students.htl-leonding.ac.at', 'Julian', 'Jaklitsch', 'jj', '4BHITM', 'jj'),
    ('l.steinhuber@students.htl-leonding.ac.at', 'Leon', 'Steinhuber', 'stoni', '4BHITM', 'stoni');

-- Inserting data into teacher table
INSERT INTO teacher (email, firstname, lastname, password, username)
VALUES
    ('m.huemer@htl-leonding.ac.at', 'Martin', 'Huemer', 'dff', 'mh'),
    ('p.engleitner@htl-leonding.ac.at', 'Particia', 'Engleitner', 'ff', 'pe');

-- favourites
INSERT INTO student_devicetype (student_student_id, favourites_type_id)
VALUES
    (1, 1),  -- Student 1 likes DeviceType 1
    (1, 2),  -- Student 1 likes DeviceType 2
    (2, 3);  -- Student 2 likes DeviceType 3

-- Inserting data into rent table
INSERT INTO rent (type, rent_end_planned, rent_start, status, creation_date, device_id, student_id, teacher_id_start)
VALUES
    ('DEFAULT', '2024-02-01', '2024-01-15', 'DECLINED', CURRENT_TIMESTAMP, 1, 1, 2),
    ('DEFAULT', '2024-03-01', '2024-02-15', 'WAITING', CURRENT_TIMESTAMP, 2, 2, 1),
    ('DEFAULT', '2024-04-01', '2024-03-15', 'CONFIRMED', CURRENT_TIMESTAMP, 3, 2, 2),
    ('DEFAULT', '2024-05-01', '2024-04-15', 'WAITING', CURRENT_TIMESTAMP, 4, 1,1),
    ('DEFAULT', '2024-05-01', '2024-04-15', 'CONFIRMED', CURRENT_TIMESTAMP, 5, 1, 1),
    ('DEFAULT', '2024-06-01', '2024-05-15', 'WAITING', CURRENT_TIMESTAMP, 6, 2, 2);

