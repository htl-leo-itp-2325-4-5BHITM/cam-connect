insert into devicetypeattribute(dtype, name, resolution, details) values ( 1, '4k', '3840 x 2160', 'Sehr cool aber große filesize');
insert into devicetypeattribute(dtype, name, details, size) values ( 2, 'Full Frame', 'crazy', 'iwie x *y millimeter');
insert into devicetypeattribute(dtype, name, details) values (3, 'L-Mount', 'Wird benutzt von Lumix, Leica und Blackmagic');

insert into DEVICETYPE (dtype, name, resolution_id, sensor_id, mount_id, autofocus, framerate) values ('CameraType', 'Lumix S5 ii', 1, 2, 3, true, 100);