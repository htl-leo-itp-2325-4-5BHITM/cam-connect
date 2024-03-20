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
insert into DEVICETYPE (variant, dtype, name, system_id, resolution_id, sensor_id, mount_id, autofocus, framerate)
values
    ('camera', 'CameraType', 'Sony A7 III', 1, 3, 4, 8, true, 120),
    ('camera', 'CameraType', 'Canon EOS R5', 1, 4, 5, 9, true, 120),
    ('camera', 'CameraType', 'Lumix S5 ii', 2, 3, 4, 6, true, 100),
    ('camera', 'CameraType', 'Lumix GH6', 2, 3, 5, 7, true, 100);

-- Simple Types
insert into DEVICETYPE (variant, dtype, name, description)
values
    ('simple', 'SimpleType', 'Kabel', '3 Meter Kabel'),
    ('simple', 'SimpleType', 'Superkabel', '5 Meter Kabel');

-- Drone Types
insert into DEVICETYPE (variant, dtype, name, sensor_id, resolution_id, max_range)
values
    ('drone', 'DroneType', 'Mavic Mini', 5, 4, 100),
    ('drone', 'DroneType', 'Mavic Pro', 6, 3, 100);

-- Lens Types
insert into DEVICETYPE (variant, dtype, name, mount_id, f_stop, focal_length)
values
    ('lens', 'LensType', 'Lens 1', 10, 2.8, 35),
    ('lens', 'LensType', 'Lens 2', 11, 3.8, 25),
    ('lens', 'LensType', 'Lens 3', 12, 4.0, 45);

-- Light Types
insert into DEVICETYPE (variant, dtype, name, watts, rgb, variable_temperature)
values
    ('light', 'LightType', 'LED', 600, true, true),
    ('light', 'LightType', 'Lampenstativ', 525, false, true);

-- Microphone Types
insert into DEVICETYPE (variant, dtype, name, windblocker, wireless, needs_recorder)
values
    ('microphone', 'MicrophoneType', 'Zoom H2', false, true, false),
    ('microphone', 'MicrophoneType', 'RodeFunkset', true, true, true),
    ('microphone', 'MicrophoneType', 'X-Vive Funks.', true, true, false);

-- Stabilizer Types
insert into DEVICETYPE (variant, dtype, name, max_weight_kilograms, number_of_axis)
values ('stabilizer', 'StabilizerType', 'Schulterrig', 200, 2),
       ('stabilizer', 'StabilizerType', 'Gopro Gimbal', 150, 3);

-- assigning tags to devicetypes
INSERT INTO tag_devicetype (tag_tag_id, type_type_id)
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
INSERT INTO rent (type, rent_end_actual, rent_end_planned, rent_start, status, creation_date, device_id, student_id, teacher_id_end, teacher_id_start, accessory, device_string, note, verification_code)
VALUES
    ('DEFAULT', '2024-02-01', '2024-02-15', '2024-01-15', 2, CURRENT_TIMESTAMP, 1, 1, 1, 2, 'Tripod', 'Camera rental for event', 'Event Coverage', 'lasdnhfgköj'),
    ('DEFAULT', '2024-03-01', '2024-03-15', '2024-02-15', 3, CURRENT_TIMESTAMP, 2, 2, 2, 1, 'Lens', 'Lens rental for project', 'Project Photography', 'lasdnhfgköj'),
    ('DEFAULT', '2024-04-01', '2024-04-15', '2024-03-15', 1, CURRENT_TIMESTAMP, 3, 2, 1, 2, 'Battery Pack', 'Additional power for shoot', 'Outdoor Photography', 'lasdnhfgköj'),
    ('DEFAULT', '2024-05-01', '2024-05-15', '2024-04-15', 4, CURRENT_TIMESTAMP, 1, 1, 2, 1, 'Microphone', 'Audio enhancement for video', 'Video Production', 'lasdnhfgköj'),
    ('DEFAULT', '2024-05-01', '2024-05-15', '2024-04-15', 4, CURRENT_TIMESTAMP, 1, 1, 2, 1, 'Microphone', 'Audio enhancement for video', 'Video Production', 'lasdnhfgköj'),
    ('DEFAULT', '2024-06-01', '2024-06-15', '2024-05-15', 2, CURRENT_TIMESTAMP, 2, 2, 1, 2, 'Tripod', 'Stable support for shooting', 'Documentary Film', 'lasdnhfgköj');

