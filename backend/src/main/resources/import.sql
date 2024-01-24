insert into devicetypeattribute(dtype, name, details) values ('CameraSystem', 'Spiegelreflex', 'DSLR mit physischem beweglichem Spiegel');
insert into devicetypeattribute(dtype, name, details) values ('CameraSystem', 'Systemkamera', 'DSLM, spiegellose Digitalkamera');

insert into devicetypeattribute(dtype, name, resolution, details) values ('CameraResolution', '4k', '3840 x 2160', 'Sehr cool aber große filesize');

insert into devicetypeattribute(dtype, name, details, size) values ('CameraSensor', 'Full Frame', 'crazy', 'iwie x * y millimeter');
insert into devicetypeattribute(dtype, name, details, size) values ('CameraSensor', 'Micro Four Thirds', 'cool', ' iwie x * y millimeter');

insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'L-Mount', 'Wird benutzt von Lumix, Leica und Blackmagic. Geignet für alle sensor größen bis inklusive full frame');
insert into devicetypeattribute(dtype, name, details) values ('LensMount', 'Micro Four Thirds', 'Für den micro four thirds sensor');

insert into DEVICETYPE (dtype, name, system_id, resolution_id, sensor_id, mount_id, autofocus, framerate) values ('CameraType', 'Lumix S5 ii', 2, 3, 4, 6, true, 100);
insert into DEVICETYPE (dtype, name, system_id, resolution_id, sensor_id, mount_id, autofocus, framerate) values ('CameraType', 'Lumix GH6', 2, 3, 5, 7, true, 100);

insert into device (type_id, note, number, serial) values
    (1, '', 'A01', '141592653589793'),
    (1, '', 'A02', '238462643383279'),
    (2, '', 'B01', '419715028869399');
