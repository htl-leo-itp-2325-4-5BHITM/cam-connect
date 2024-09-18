-- Camera Systems
insert into devicetypeattribute(dtype, name, details) values ('CameraSystem', 'Spiegelreflex', 'DSLR mit physischem beweglichem Spiegel');
insert into devicetypeattribute(dtype, name, details) values ('CameraSystem', 'Systemkamera', 'DSLM, spiegellose Digitalkamera');

-- Camera Resolutions
insert into devicetypeattribute(dtype, name, resolution, details) values ('CameraResolution', '4k', '3840 x 2160', 'Sehr cool aber große filesize');
insert into devicetypeattribute(dtype, name, resolution, details) values ('CameraResolution', '1080p', '1920 x 1080', 'Standard High Definition resolution');
insert into devicetypeattribute(dtype, name, resolution, details) values ('CameraResolution', '720p', '1280 x 720', 'Standard High Definition resolution');

-- Lens Mounts
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'Canon RF', 'Used by Canon mirrorless cameras');
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'Nikon Z', 'Used by Nikon mirrorless cameras');
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'L-Mount', 'Wird benutzt von Lumix, Leica und Blackmagic. Geignet für alle sensor größen bis inklusive full frame');
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'Micro Four Thirds', 'Für den micro four thirds sensor');

-- Tripod Heads
insert into devicetypeattribute(dtype, name, details) values ('TripodHead', '2 axis', '2 achsen ajustierbar');
insert into devicetypeattribute(dtype, name, details) values ('TripodHead', '3 axis', '3 achsen ajustierbar');
insert into devicetypeattribute(dtype, name, details) values ('TripodHead', 'Ballhead', 'In alle richtungen adjustierbarer Kugelkopf');

-- Tripod Heads
insert into devicetypeattribute(dtype, name, details) values ('AudioConnector', 'wireless', 'verbindet sich via bluetooth oder einem eigenen sender');
insert into devicetypeattribute(dtype, name, details) values ('AudioConnector', 'aux', '3.5mm aux');
insert into devicetypeattribute(dtype, name, details) values ('AudioConnector', 'XLR', '3 pin XLR connector');

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

INSERT INTO devicetype (type_id, name, image_blob_url, variant, dtype, connector_id)
VALUES
    (1, 'Audio Type 1', 'url1', 'audio', 'AudioType', 1),
    (2, 'Audio Type 2', 'url2', 'audio', 'AudioType', 2),
    (3, 'Audio Type 3', 'url3', 'audio', 'AudioType', 3),
    (4, 'Audio Type 4', 'url4', 'audio', 'AudioType', 1),
    (5, 'Audio Type 5', 'url5', 'audio', 'AudioType', 2);

INSERT INTO devicetype (type_id, name, image_blob_url, variant, dtype, f_stop, focal_length, mount_id)
VALUES
    (1, 'Lens Type 1', 'url1', 'lens', 'LensType', 'f1.8', '50mm', 1),
    (2, 'Lens Type 2', 'url2', 'lens', 'LensType', 'f2.8', '35mm', 2),
    (3, 'Lens Type 3', 'url3', 'lens', 'LensType', 'f1.4', '85mm', 3),
    (4, 'Lens Type 4', 'url4', 'lens', 'LensType', 'f2.0', '24mm', 1),
    (5, 'Lens Type 5', 'url5', 'lens', 'LensType', 'f2.8', '70-200mm', 2);

INSERT INTO devicetype (type_id, name, image_blob_url, variant, dtype, watts, rgb, variable_temperature)
VALUES
    (1, 'Light Type 1', 'url1', 'light', 'LightType', 100, true, false),
    (2, 'Light Type 2', 'url2', 'light', 'LightType', 200, false, true),
    (3, 'Light Type 3', 'url3', 'light', 'LightType', 300, true, true),
    (4, 'Light Type 4', 'url4', 'light', 'LightType', 400, false, false),
    (5, 'Light Type 5', 'url5', 'light', 'LightType', 500, true, false);

INSERT INTO devicetype (type_id, name, image_blob_url, variant, dtype, needs_recorder, connector_id, needs_power)
VALUES
(1, 'Microphone Type 1', 'url1', 'microphone', 'MicrophoneType', true, 1, false),
(2, 'Microphone Type 2', 'url2', 'microphone', 'MicrophoneType', false, 2, true),
(3, 'Microphone Type 3', 'url3', 'microphone', 'MicrophoneType', true, 3, false),
(4, 'Microphone Type 4', 'url4', 'microphone', 'MicrophoneType', false, 1, true),
(5, 'Microphone Type 5', 'url5', 'microphone', 'MicrophoneType', true, 2, false);

INSERT INTO devicetype (type_id, name, image_blob_url, variant, dtype, description)
VALUES
(1, 'Simple Type 1', 'url1', 'simple', 'SimpleType', 'Description 1'),
(2, 'Simple Type 2', 'url2', 'simple', 'SimpleType', 'Description 2'),
(3, 'Simple Type 3', 'url3', 'simple', 'SimpleType', 'Description 3'),
(4, 'Simple Type 4', 'url4', 'simple', 'SimpleType', 'Description 4'),
(5, 'Simple Type 5', 'url5', 'simple', 'SimpleType', 'Description 5');

INSERT INTO devicetype (type_id, name, image_blob_url, variant, dtype, max_weight_kilograms, number_of_axis)
VALUES
(1, 'Stabilizer Type 1', 'url1', 'stabilizer', 'StabilizerType', 2.5, 3),
(2, 'Stabilizer Type 2', 'url2', 'stabilizer', 'StabilizerType', 3.0, 2),
(3, 'Stabilizer Type 3', 'url3', 'stabilizer', 'StabilizerType', 1.5, 3),
(4, 'Stabilizer Type 4', 'url4', 'stabilizer', 'StabilizerType', 2.0, 2),
(5, 'Stabilizer Type 5', 'url5', 'stabilizer', 'StabilizerType', 2.5, 3);

INSERT INTO devicetype (type_id, name, image_blob_url, variant, dtype, height_centimeters, head_id)
VALUES
(1, 'Tripod Type 1', 'url1', 'tripod', 'TripodType', 150, 1),
(2, 'Tripod Type 2', 'url2', 'tripod', 'TripodType', 180, 2),
(3, 'Tripod Type 3', 'url3', 'tripod', 'TripodType', 200, 3),
(4, 'Tripod Type 4', 'url4', 'tripod', 'TripodType', 170, 1),
(5, 'Tripod Type 5', 'url5', 'tripod', 'TripodType', 160, 2);

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
INSERT INTO app_user (dtype, email, firstname, lastname, password, school_class, username)
VALUES
    ('Student', 'm.leisch@students.htl-leonding.ac.at', 'Michael', 'Leisch', 'michiiii', '4BHITM', 'michiii'),
    ('Student', 'y.kendler@students.htl-leonding.ac.at', 'Yanik', 'Kendler', 'yanuki', '4BHITM', 'yanuki'),
    ('Student', 'j.jaklitsch@students.htl-leonding.ac.at', 'Julian', 'Jaklitsch', 'jj', '4BHITM', 'jj'),
    ('Student', 'l.steinhuber@students.htl-leonding.ac.at', 'Leon', 'Steinhuber', 'stoni', '4BHITM', 'stoni');

-- Inserting data into teacher table
INSERT INTO app_user (dtype, email, firstname, lastname, password, username)
VALUES
    ('Teacher', 'm.huemer@htl-leonding.ac.at', 'Martin', 'Huemer', 'dff', 'mh'),
    ('Teacher', 'p.engleitner@htl-leonding.ac.at', 'Particia', 'Engleitner', 'ff', 'pe');

-- favourites
INSERT INTO app_user_devicetype (student_user_id, favourites_type_id)
VALUES
    (1, 1),  -- Student 1 likes DeviceType 1
    (1, 2),  -- Student 1 likes DeviceType 2
    (2, 3);  -- Student 2 likes DeviceType 3

-- Inserting data into rent table
INSERT INTO rent (type, rent_end_planned, rent_start, status, creation_date, device_id, student_id, teacher_id_start)
VALUES
    ('DEFAULT', '2024-02-01', '2024-01-15', 'DECLINED', CURRENT_TIMESTAMP, 1, 1, 6),
    ('DEFAULT', '2024-03-01', '2024-02-15', 'WAITING', CURRENT_TIMESTAMP, 2, 2, 5),
    ('DEFAULT', '2024-04-01', '2024-03-15', 'CONFIRMED', CURRENT_TIMESTAMP, 3, 3, 6),
    ('DEFAULT', '2024-05-01', '2024-04-15', 'WAITING', CURRENT_TIMESTAMP, 4, 4,5),
    ('DEFAULT', '2024-05-01', '2024-04-15', 'CONFIRMED', CURRENT_TIMESTAMP, 5, 1, 5),
    ('DEFAULT', '2024-06-01', '2024-05-15', 'WAITING', CURRENT_TIMESTAMP, 6, 2, 6);

