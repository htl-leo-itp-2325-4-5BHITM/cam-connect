insert into devicetypeattribute(dtype, name, details) values ('CameraSystem', 'Spiegelreflex', 'DSLR mit physischem beweglichem Spiegel');
insert into devicetypeattribute(dtype, name, details) values ('CameraSystem', 'Systemkamera', 'DSLM, spiegellose Digitalkamera');

insert into devicetypeattribute(dtype, name, resolution, details) values ('CameraResolution', '4k', '3840 x 2160', 'Sehr cool aber große filesize');

insert into devicetypeattribute(dtype, name, details, size) values ('CameraSensor', 'Full Frame', 'crazy', 'iwie x * y millimeter');
insert into devicetypeattribute(dtype, name, details, size) values ('CameraSensor', 'Micro Four Thirds', 'cool', ' iwie x * y millimeter');
-- Additional Camera Resolutions
insert into devicetypeattribute(dtype, name, resolution, details) values ('CameraResolution', '1080p', '1920 x 1080', 'Standard High Definition resolution');
insert into devicetypeattribute(dtype, name, resolution, details) values ('CameraResolution', '720p', '1280 x 720', 'Standard High Definition resolution');

-- Additional Camera Sensors
insert into devicetypeattribute(dtype, name, details, size) values ('CameraSensor', 'APS-C', 'Good balance of size and quality', 'iwie x * y millimeter');
insert into devicetypeattribute(dtype, name, details, size) values ('CameraSensor', 'Medium Format', 'Larger sensor for higher image quality', 'iwie x * y millimeter');


-- Additional Lens Mounts
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'Canon RF', 'Used by Canon mirrorless cameras');
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'Nikon Z', 'Used by Nikon mirrorless cameras');

-- Additional Camera Types
insert into DEVICETYPE (dtype, name, system_id, resolution_id, sensor_id, mount_id, autofocus, framerate) values ('CameraType', 'Sony A7 III', 1, 3, 4, 8, true, 120);
insert into DEVICETYPE (dtype, name, system_id, resolution_id, sensor_id, mount_id, autofocus, framerate) values ('CameraType', 'Canon EOS R5', 1, 4, 5, 9, true, 120);



insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'L-Mount', 'Wird benutzt von Lumix, Leica und Blackmagic. Geignet für alle sensor größen bis inklusive full frame');
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'Micro Four Thirds', 'Für den micro four thirds sensor');

insert into DEVICETYPE (dtype, name, system_id, resolution_id, sensor_id, mount_id, autofocus, framerate) values ('CameraType', 'Lumix S5 ii', 2, 3, 4, 6, true, 100);
insert into DEVICETYPE (dtype, name, system_id, resolution_id, sensor_id, mount_id, autofocus, framerate) values ('CameraType', 'Lumix GH6', 2, 3, 5, 7, true, 100);

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
                                                       (1, '', 'A04', '169399375105820'),
                                                       (2, 'Secondary camera', 'B04', '582097494459230'),
                                                       (3, 'Studio setup', 'C03', '781640628620899'),
                                                       (4, 'Wildlife photography', 'D03', '862803482534211');
