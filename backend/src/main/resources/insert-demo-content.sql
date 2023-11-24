/*TODO fix something here that causes the primary key errors*/

INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Anna', 'Schmidt', 'passwort1', '1CHITM', 'IT200271');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Lukas', 'Müller', 'passwort2', '2AHITM', 'IT200272');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Sophie', 'Wagner', 'passwort3', '3BHITM', 'IT200273');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Max', 'Hofmann', 'passwort4', '4CHITM', 'IT200274');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Emma', 'Klein', 'passwort5', '5AHITM', 'IT200275');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Leon', 'Schulz', 'passwort6', '1BHITM', 'IT200276');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Mia', 'Herrmann', 'passwort7', '2CHITM', 'IT200277');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Tim', 'Becker', 'passwort8', '3AHITM', 'IT200278');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Lena', 'Schneider', 'passwort9', '4CHITM', 'IT200279');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Finn', 'Koch', 'passwort10', '5BHITM', 'IT200280');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Laura', 'Bauer', 'passwort11', '1AHITM', 'IT200281');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Elias', 'Schuster', 'passwort12', '2BHITM', 'IT200282');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Hannah', 'Wolf', 'passwort13', '3CHITM', 'IT200283');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Paul', 'Lange', 'passwort14', '4AHITM', 'IT200284');
INSERT INTO student (student_id, firstname, lastname, password, school_class, user_id) VALUES (NEXT VALUE FOR student_seq, 'Clara', 'Graf', 'passwort15', '5CHITM', 'IT200285');


INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES
                                                                     (NEXT VALUE FOR teacher_seq, 'Professor', 'Johnson', 'teacherpass', 'prof_johnson');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES  (NEXT VALUE FOR teacher_seq, 'Dr.', 'Williams', 'pass123', 'dr_williams');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES (NEXT VALUE FOR teacher_seq, 'Ms.', 'Smith', 'teacherpass', 'ms_smith');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES  (NEXT VALUE FOR teacher_seq, 'Mr.', 'Jones', 'pass123', 'mr_jones');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES (NEXT VALUE FOR teacher_seq, 'Dr.', 'Miller', 'teacherpass', 'dr_miller');
INSERT INTO Teacher (teacher_id, firstname, lastname, password, username) VALUES (NEXT VALUE FOR teacher_seq, 'Mrs.', 'Brown', 'pass123', 'mrs_brown');

INSERT INTO LensMount (mount_id, name) VALUES
    (NEXT VALUE FOR lens_mount_seq, 'Canon EF');
INSERT INTO LensMount (mount_id, name) VALUES
    (NEXT VALUE FOR lens_mount_seq, 'Nikon F');
INSERT INTO LensMount (mount_id, name) VALUES
    (NEXT VALUE FOR lens_mount_seq, 'Sony E');
INSERT INTO LensMount (mount_id, name) VALUES
    (NEXT VALUE FOR lens_mount_seq, 'Pentax K');
INSERT INTO LensMount (mount_id, name) VALUES
    (NEXT VALUE FOR lens_mount_seq, 'Fujifilm X');
INSERT INTO LensMount (mount_id, name) VALUES
    (NEXT VALUE FOR lens_mount_seq, 'Olympus/Panasonic Micro Four Thirds');

/*
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (1, '2023-01-01', '2023-01-05', NEXT VALUE FOR rent_seq, '2023-01-02', 1, 1);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (2, '2023-02-01', '2023-02-10', NEXT VALUE FOR rent_seq, '2023-02-05', 2, 2);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (3, '2023-03-01', '2023-03-15', NEXT VALUE FOR rent_seq, '2023-03-10', 3, 3);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (4, '2023-04-01', '2023-04-20', NEXT VALUE FOR rent_seq, '2023-04-15', 4, 4);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (5, '2023-05-01', '2023-05-25', NEXT VALUE FOR rent_seq, '2023-05-20', 5, 5);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (6, '2023-06-01', '2023-06-08', NEXT VALUE FOR rent_seq, '2023-06-05', 6, 6);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (7, '2023-07-01', '2023-07-12', NEXT VALUE FOR rent_seq, '2023-07-08', 7, 7);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (8, '2023-08-01', '2023-08-18', NEXT VALUE FOR rent_seq, '2023-08-15', 8, 8);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (9, '2023-09-01', '2023-09-22', NEXT VALUE FOR rent_seq, '2023-09-20', 9, 9);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (10, '2023-10-01', '2023-10-30', NEXT VALUE FOR rent_seq, '2023-10-25', 10, 10);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (11, '2023-11-01', '2023-11-10', NEXT VALUE FOR rent_seq, '2023-11-05', 11, 11);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (12, '2023-12-01', '2023-12-15', NEXT VALUE FOR rent_seq, '2023-12-10', 12, 12);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (13, '2024-01-01', '2024-01-08', NEXT VALUE FOR rent_seq, '2024-01-05', 13, 13);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (14, '2024-02-01', '2024-02-18', NEXT VALUE FOR rent_seq, '2024-02-15', 14, 14);
INSERT INTO rent (DEVICE_ID, RENT_END_ACTUAL, RENT_END_PLANNED, RENT_ID, RENT_START, STUDENT_ID, TEACHER_ID) VALUES (15, '2024-03-01', '2024-03-12', NEXT VALUE FOR rent_seq, '2024-03-08', 15, 15);
*/

insert into tag (tag_id, name, description) values (NEXT VALUE FOR tag_seq, 'Foto', 'Dieses Gerät ist am besten für Fotografie geeignet');
insert into tag (tag_id, name, description) values (NEXT VALUE FOR tag_seq, 'Video', 'Dieses Gerät ist am besten fürs filmen von Videos geeignet');
insert into tag (tag_id, name, description) values (NEXT VALUE FOR tag_seq, 'Makro', 'Dieses Gerät ist spezifisch für Makrofotografie gedacht');