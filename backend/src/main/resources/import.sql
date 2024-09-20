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

-- Audio Connectors
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
*/
-- Audio
INSERT INTO devicetype (name, image_blob, variant, dtype, connector_id, status)
VALUES
    ('Sennheiser HD 600', 'url1', 'audio', 'AudioType', 13, 'active'),
    ('Bose QuietComfort 35', 'url2', 'audio', 'AudioType', 14, 'active'),
    ('Sony WH-1000XM4', 'url3', 'audio', 'AudioType', 15, 'active'),
    ('Audio-Technica ATH-M50X', 'url4', 'audio', 'AudioType', 14, 'active'),
    ('AKG K702', 'url5', 'audio', 'AudioType', 13, 'active');

-- Lenses
INSERT INTO devicetype (name, image_blob, variant, dtype, f_stop, focal_length, mount_id, status)
VALUES
    ( 'Canon EF 50mm f/1.8 STM', 'url1', 'lens', 'LensType', 'f1.8', '50mm', 6, 'active'),
    ( 'Nikon Z 35mm f/1.8 S', 'url2', 'lens', 'LensType', 'f2.8', '35mm', 7, 'active'),
    ( 'Sony FE 85mm f/1.4 GM', 'url3', 'lens', 'LensType', 'f1.4', '85mm', 8, 'active'),
    ( 'Fujifilm XF 24mm f/2.0 R', 'url4', 'lens', 'LensType', 'f2.0', '24mm', 6, 'active'),
    ( 'Sigma 70-200mm f/2.8 DG OS HSM', 'url5', 'lens', 'LensType', 'f2.8', '70-200mm', 7, 'active');

-- Lights
INSERT INTO devicetype (name, image_blob, variant, dtype, watts, rgb, variable_temperature, status)
VALUES
    ( 'Aputure LS C300d II', 'url1', 'light', 'LightType', 100, true, false, 'active'),
    ( 'Godox SL-200W II', 'url2', 'light', 'LightType', 200, false, true, 'active'),
    ( 'Nanlite Forza 300B', 'url3', 'light', 'LightType', 300, true, true, 'active'),
    ( 'Neewer 400W LED', 'url4', 'light', 'LightType', 400, false, false, 'active'),
    ( 'Yongnuo YN360 III Pro', 'url5', 'light', 'LightType', 500, true, false, 'active');

-- Microphones
INSERT INTO devicetype (name, image_blob, variant, dtype, needs_recorder, connector_id, needs_power, status)
VALUES
    ( 'Shure SM7B', 'url1', 'microphone', 'MicrophoneType', true, 13, false, 'active'),
    ( 'Rode NT1-A', 'url2', 'microphone', 'MicrophoneType', false, 13, true, 'active'),
    ( 'Audio-Technica AT2020', 'url3', 'microphone', 'MicrophoneType', true, 14, false, 'active'),
    ( 'Blue Yeti X', 'url4', 'microphone', 'MicrophoneType', false, 14, true, 'active'),
    ( 'AKG C414 XLII', 'url5', 'microphone', 'MicrophoneType', true, 15, false, 'active');

-- Simple
INSERT INTO devicetype (name, image_blob, variant, dtype, description, status)
VALUES
    ( 'Samsung Galaxy Buds', 'url1', 'simple', 'SimpleType', 'Wireless earbuds', 'active'),
    ( 'Apple AirPods Pro', 'url2', 'simple', 'SimpleType', 'Noise-canceling earbuds', 'active'),
    ( 'Beats Powerbeats Pro', 'url3', 'simple', 'SimpleType', 'Sport wireless earbuds', 'active'),
    ( 'Jabra Elite 75t', 'url4', 'simple', 'SimpleType', 'Bluetooth earbuds', 'active'),
    ( 'Sony WF-1000XM3', 'url5', 'simple', 'SimpleType', 'True wireless noise-canceling earbuds', 'active');

-- Stabilizers
INSERT INTO devicetype (name, image_blob, variant, dtype, max_weight_kilograms, number_of_axis, status)
VALUES
    ( 'DJI Ronin-S', 'url1', 'stabilizer', 'StabilizerType', 2.5, 3, 'active'),
    ( 'Zhiyun Crane 2', 'url2', 'stabilizer', 'StabilizerType', 3.0, 2, 'active'),
    ( 'FeiyuTech G6 Max', 'url3', 'stabilizer', 'StabilizerType', 1.5, 3, 'active'),
    ( 'Moza Air 2', 'url4', 'stabilizer', 'StabilizerType', 2.0, 2, 'active'),
    ( 'Gudsen Moza Mini-P', 'url5', 'stabilizer', 'StabilizerType', 2.5, 3, 'active');

-- Tripods
INSERT INTO devicetype (name, image_blob, variant, dtype, height_centimeters, head_id, status)
VALUES
    ( 'Manfrotto MT190XPRO3', 'url1', 'tripod', 'TripodType', 150, 10, 'active'),
    ( 'Benro A2573F', 'url2', 'tripod', 'TripodType', 180, 11, 'active'),
    ( 'Gitzo GT3543LS', 'url3', 'tripod', 'TripodType', 200, 12, 'active'),
    ( 'Vanguard Alta Pro 2', 'url4', 'tripod', 'TripodType', 170, 11, 'active'),
    ( 'Slik Pro 700DX', 'url5', 'tripod', 'TripodType', 160, 10, 'active');

-- Drones
INSERT INTO devicetype (name, image_blob, variant, dtype, max_range_kilometers, flight_time_minutes, requires_license, status)
VALUES
    ('DJI Mavic Pro', 'url1', 'drone', 'DroneType', 7, 27, true, 'active'),
    ('Parrot Anafi', 'url2', 'drone', 'DroneType', 4, 25, false, 'active'),
    ('Autel Evo II', 'url3', 'drone', 'DroneType', 9, 40, true, 'active'),
    ('DJI Phantom 4', 'url4', 'drone', 'DroneType', 5, 28, true, 'active'),
    ('Yuneec Typhoon H Pro', 'url5', 'drone', 'DroneType', 1, 25, false, 'active');

-- Cameras

INSERT INTO devicetype (name, image_blob, variant, dtype, mount_id, system_id, autofocus, status)
VALUES
    ('Canon EOS 5D Mark IV', 'url1', 'camera', 'CameraType', 6, 1, true, 'active'),
    ('Nikon D850', 'url2', 'camera', 'CameraType', 6, 2, true, 'active'),
    ('Sony Alpha a7 III', 'url3', 'camera', 'CameraType', 7, 1, true, 'active'),
    ('Fujifilm X-T3', 'url4', 'camera', 'CameraType', 7, 1, false, 'active'),
    ('Olympus OM-D E-M10 Mark III', 'url5', 'camera', 'CameraType', 8, 2, true, 'active');

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

