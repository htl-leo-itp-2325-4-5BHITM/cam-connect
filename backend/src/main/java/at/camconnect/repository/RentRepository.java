package at.camconnect.repository;

import at.camconnect.dtos.filters.RentFilters;
import at.camconnect.dtos.rent.*;
import at.camconnect.enums.RentStatusEnum;
import at.camconnect.enums.RentTypeEnum;
import at.camconnect.model.*;
import at.camconnect.responseSystem.CCException;
import at.camconnect.socket.RentSocket;
import at.camconnect.responseSystem.CCResponse;
import io.vertx.ext.mail.MailClient;
import io.vertx.ext.mail.MailMessage;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import org.hibernate.exception.ConstraintViolationException;

import java.io.*;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class RentRepository {
    @Inject
    EntityManager em;

    @Inject
    MailClient client;

    @Inject
    RentSocket rentSocket;

    @Inject
    DeviceRepository deviceRepository;

    @Transactional
    public void create(List<CreateRentDTO> rentDTOs){
        List<Rent> rents = new LinkedList<>();

        for(CreateRentDTO rentDTO : rentDTOs){
            if(deviceRepository.isDeviceAlreadyInUse(rentDTO.device_id())) {
                throw new CCException(1201, "Device is already used in an other rent");
            }

            Rent rent;
            if(rentDTO.type() == RentTypeEnum.DEFAULT){
                rent = new Rent(
                        em.find(Student.class, rentDTO.student_id()),
                        deviceRepository.getById(rentDTO.device_id()),
                        em.find(Teacher.class, rentDTO.teacher_start_id()),
                        rentDTO.rent_start(),
                        rentDTO.rent_end_planned(),
                        rentDTO.note()
                );
            } else if (rentDTO.type() == RentTypeEnum.STRING){
                rent = new Rent(
                        em.find(Student.class, rentDTO.student_id()),
                        rentDTO.device_string(),
                        em.find(Teacher.class, rentDTO.teacher_start_id()),
                        rentDTO.rent_start(),
                        rentDTO.rent_end_planned(),
                        rentDTO.note()
                );
            }
            else{
                throw new CCException(1206, "Provided rent type was invalid");
            }

            rents.add(rent);
            em.persist(rent);
        }

        sendConfirmationEmail(rents);
        rentSocket.broadcast();
    }

    //TODO remove when abandoning old web
    @Transactional
    public void createEmpty(){
        /*em.persist(new Rent());
        rentSocket.broadcast();*/
    }

    @Transactional
    public Response remove(Long id){
        getById(id).setStatus(RentStatusEnum.DELETED);
        rentSocket.broadcast();
        return CCResponse.ok();
    }

    /*
    * INFO
    * about the select syntax used in both the getAlls
    * quarkus can handle the incredibly complex joins to all multiple tables and all their children through inheritance
    * just fine when you select a nativeObject, when however selecting a new RentDTO it all breaks down and throws cryptic errors
    * without line numbers if your lucky or just does not return any results at all if any of the joined tables are null
    *
    * just leave it as streams and don't touch
    */

    public List<RentDTO> getAllSingleList(){
        return em.createQuery("SELECT r FROM Rent r where r.status != 'DELETED' order by r.creation_date", Rent.class)
                .getResultStream()
                .map(rent -> new RentDTO(
                        rent.getRent_id(),
                        rent.getStatus(),
                        rent.getType(),
                        rent.getDevice(),
                        rent.getDevice_string(),
                        rent.getTeacher_start(),
                        rent.getTeacher_end(),
                        rent.getRent_start(),
                        rent.getRent_end_planned(),
                        rent.getRent_end_actual(),
                        rent.getAccessory(),
                        rent.getStudent(),
                        rent.getNote(),
                        rent.getVerification_message(),
                        rent.getCreation_date(),
                        rent.getChange_date()
                ))
                .collect(Collectors.toList());

    }

    public List<RentByStudentDTO> getAll(RentFilters filters){

        String orderByString = "";
        switch (filters.orderBy()) {
            case ALPHABETICAL_ASC: orderByString = "order by s.firstname asc, s.lastname asc"; break;
            case ALPHABETICAL_DESC: orderByString = "order by s.firstname desc, s.lastname desc"; break;
            case DATE_ASC: orderByString = "order by MAX(r.change_date) asc"; break;
            case DATE_DESC: orderByString = "order by MAX(r.change_date) desc"; break;
        }

        List<Student> students = em.createQuery(
                "SELECT s FROM Rent r " +
                        "join Student s on r.student.student_id = s.student_id " +
                        "where (s.school_class IN :schoolClasses OR :schoolClassesEmpty = true) " +
                        "and (s.student_id IN :studentIds OR :studentIdsEmpty = true) " +
                        "group by s.student_id " +
                        orderByString
                ,Student.class)
                .setParameter("schoolClasses", filters.schoolClasses())
                .setParameter("schoolClassesEmpty", filters.schoolClasses() == null || filters.schoolClasses().isEmpty())
                .setParameter("studentIds", filters.studentIds())
                .setParameter("studentIdsEmpty", filters.studentIds() == null || filters.studentIds().isEmpty())
                .getResultList();

        List<RentByStudentDTO> result = new LinkedList<>();

        //INFO
        //this is currently just joining to half the db and not using a proper DTO,
        // this might cause performance problems in the future but is fine for now
        for (Student student : students) {
            List<RentDTO> rents = em.createQuery(
                    "SELECT r FROM Rent r " +
                            "where r.student.student_id = :studentId " +
                            "and (r.status IN :statuses OR :statusesEmpty = true) " +
                            "order by r.id"
                    , Rent.class)
                    .setParameter("studentId", student.getStudent_id())
                    .setParameter("statuses", filters.statuses())
                    .setParameter("statusesEmpty", filters.statuses() == null || filters.statuses().isEmpty())
                    .getResultStream()
                    .map(rent -> new RentDTO(
                            rent.getRent_id(),
                            rent.getStatus(),
                            rent.getType(),
                            rent.getDevice(),
                            rent.getDevice_string(),
                            rent.getTeacher_start(),
                            rent.getTeacher_end(),
                            rent.getRent_start(),
                            rent.getRent_end_planned(),
                            rent.getRent_end_actual(),
                            rent.getAccessory(),
                            rent.getStudent(),
                            rent.getNote(),
                            rent.getVerification_message(),
                            rent.getCreation_date(),
                            rent.getChange_date()
                    ))
                    .collect(Collectors.toList());

            result.add(new RentByStudentDTO(student, rents));
        }
        return result;
    }

    public Rent getById(Long id){
        Rent result = em.find(Rent.class, id);
        if (result == null) throw new CCException(1101);
        return result;
    }

    public RentDTO getByIdCensored(Long id){
        Rent rent = getById(id);
        return new RentDTO(rent.getRent_id(), rent.getStatus(), rent.getType(), rent.getDevice(), rent.getDevice_string(), rent.getTeacher_start(), rent.getTeacher_end(), rent.getRent_start(), rent.getRent_end_planned(), rent.getRent_end_actual(), rent.getAccessory(), rent.getStudent(), rent.getNote(), rent.getVerification_message(), rent.getCreation_date(), rent.getChange_date());
    }

    public List<RentDTO> getByIdList(String[] idList){
        List<RentDTO> result = new LinkedList<>();
        for(String id : idList){
            result.add(getByIdCensored(Long.parseLong(id)));
        }
        return result;
    }

    @Transactional
    public void sendConfirmationEmail(List<Rent> rentList){
        for (Rent rent : rentList) {
            rent.setStatus(RentStatusEnum.WAITING);
            rent.generateVerification_code();
            em.merge(rent);
        }

        MailMessage message = generateConfirmationMailMessage(rentList);

        client.sendMail(message, result -> {
            if (result.succeeded()) {
                System.out.println("Email sent successfully");
            } else {
                System.out.println("Failed to send email: " + result.cause());
                throw new CCException(1200, "Failed to send mail");
            }
        });
    }

    @Transactional
    public MailMessage generateConfirmationMailMessage(List<Rent> rents) {
        //TODO do this with env variables
        String FRONTEND_URL = "http://144.24.171.164/public/";

        String os = System.getProperty("os.name").toLowerCase();

        if (os.contains("win")) {
            FRONTEND_URL = "http://localhost:4200";
        }

        MailMessage message = new MailMessage();
        message.setFrom("signup.camconnect@gmail.com");
        String email = rents.get(0).getStudent().getEmail();
        message.setTo(email);
        message.setSubject("Bestätigung des Geräteverleih");

        StringBuilder rentListString = new StringBuilder();
        StringBuilder verificationCodes = new StringBuilder();
        StringBuilder rentIds = new StringBuilder();

        boolean first = true;
        for (Rent rent : rents) {
            if(first){
                first = false;
            }
            else{
                verificationCodes.append(",");
                rentIds.append(",");
            }

            verificationCodes.append(rent.getVerification_code());
            rentIds.append(rent.getRent_id());

            if(rent.getType() == RentTypeEnum.DEFAULT)
                rentListString.append("<p>" + rent.getDevice().getType().getName() + " " + rent.getDevice().getNumber() + " von: " + rent.getRent_start() + " bis: " + rent.getRent_end_planned() + "</p>");
            else
                rentListString.append("<p>" + rent.getDevice_string() + " von: " + rent.getRent_start() + " bis: " + rent.getRent_end_planned() + "</p>");
        }

        String url = FRONTEND_URL + "/confirm?ids=" + rentIds + "&codes=" + verificationCodes;

        System.out.println(url);

        message.setHtml("Bitte bestätige oder lehne deinen Verleih ab:<br>" +
                rentListString +
                 "<div><a style='margin: 2rem; padding: .5rem 1rem; color: black;' href='" + url + "'>Zur Übersicht</a>");

        return message;
    }

    public boolean verifyConfirmationCode(Long id, String code){
        Rent rent = getById(id);
        if(rent.generateVerification_code() == null) return false;
        return rent.getVerification_code().equals(code);
    }

    @Transactional
    public void updateStatus(Long rentId, RentIdsDTO rentIdsDTO) {
        Rent rent = getById(rentId);

        if(!rent.getStatus().equals(RentStatusEnum.WAITING)){
            throw new CCException(1201);
        }

        String verificationCode;
        String verificationMessage;
        RentStatusEnum verificationStatus;

        try{
            verificationCode = rentIdsDTO.verification_code();
            verificationStatus = rentIdsDTO.status();
            verificationMessage = rentIdsDTO.verification_message();
        } catch (IllegalArgumentException e) {
            throw new CCException(1106);
        }

        Set<RentStatusEnum> allowedStatus = Set.of(RentStatusEnum.CONFIRMED, RentStatusEnum.DECLINED);
        // set only if the current status is allowed and if the verification_code is the same as provided
        if (allowedStatus.contains(verificationStatus) && rent.getVerification_code().equals(verificationCode)) {
            rent.setStatus(verificationStatus);
            rent.setVerification_message(verificationMessage);
            em.merge(rent);
        } else{
            throw new CCException(1205, "Message: " + verificationMessage + ", Status: " + verificationStatus + ", Code: " + verificationCode);
        }

        rentSocket.broadcast();
    }

    @Transactional
    public void returnRent(Long rentId){
        Rent rent = getById(rentId);

        //instant return if already confirmed
        if(!rent.getStatus().equals(RentStatusEnum.CONFIRMED)){
            throw new CCException(1205);
        }

        rent.setStatus(RentStatusEnum.RETURNED);
        em.merge(rent);

        MailMessage message = new MailMessage();
        message.setFrom("signup.camconnect@gmail.com");
        String email = rent.getStudent().getEmail();
        message.setTo(email);
        message.setSubject("Bestätigung der Gerät Rückgabe");

        if(rent.getType() == RentTypeEnum.DEFAULT)
            message.setHtml("Ihr Verleih von " + rent.getDevice().getType().getName() + " " + rent.getDevice().getNumber() + " vom: " + rent.getRent_start() + " bis: " + rent.getRent_end_actual() + ", wurde zurückgegeben.");
        else
            message.setHtml("Ihr Verleih von " + rent.getDevice_string() + " vom: " + rent.getRent_start() + " bis: " + rent.getRent_end_actual() + ", wurde zurückgegeben.");

        client.sendMail(message, result -> {
            if (result.succeeded()) {
                System.out.println("Email sent successfully");
            } else {
                System.out.println("Failed to send email: " + result.cause());
                throw new CCException(1200, "Failed to send mail");
            }
        });

        rentSocket.broadcast();
    }

    @Transactional
    public void update(Long id, JsonObject rentJson){
        if(rentJson == null) throw new CCException(1105);

        if(validateJsonKey(rentJson,"student_id"))
            try{ setStudent(id, rentJson.getInt("student_id")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update student_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"teacher_start_id"))
            try{ setTeacherStart(id, rentJson.getInt("teacher_start_id")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update teacher_start_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"teacher_end_id"))
            try{ setTeacherEnd(id, rentJson.getInt("teacher_end_id")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update teacher_end_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"device_id"))
            try{ setDevice(id, rentJson.getInt("device_id")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update device_id " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"rent_start"))
            try{ setRentStart(id, rentJson.getString("rent_start")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update rent_start " + ex.getMessage()); }

        if(validateJsonKey(rentJson, "rent_end_planned"))
            try{ setRentEndPlanned(id, rentJson.getString("rent_end_planned")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update rent_end_planned " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"rent_end_actual"))
            try{ setRentEndActual(id, rentJson.getString("rent_end_actual"));}
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update rent_end_actual " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"status"))
            try{ updateStatus(id, rentJson.getString("status")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update status " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"note"))
            try{ setNote(id, rentJson.getString("note")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update note " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"accessory"))
            try{ setAccessory(id, rentJson.getString("accessory")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update accessory " + ex.getMessage()); }

        if(validateJsonKey(rentJson,"device_string"))
            try{ setDeviceString(id, rentJson.getString("device_string")); }
            catch (CCException ccex){ throw ccex; }
            catch(Exception ex){ throw new CCException(1105, "cannot update device_string " + ex.getMessage()); }

        rentSocket.broadcast();
    }

    @Transactional
    public void updateProperty(String property, Long rentId, JsonObject data){
        Rent rent = getById(rentId);

        switch (property){
            case "student":
                Student student = em.find(Student.class, data.getInt("value"));
                rent.setStudent(student);
                break;
            case "device":
                Device device = em.find(Device.class, data.getInt("value"));
                rent.setDevice(device);
                break;
            case "teacher_start":
                Teacher teacherStart = em.find(Teacher.class, data.getInt("value"));
                rent.setTeacher_start(teacherStart);
                break;
            case "teacher_end":
                Teacher teacherEnd = em.find(Teacher.class, data.getInt("value"));
                rent.setTeacher_end(teacherEnd);
                break;
            case "rent_start":
                System.out.println("updating rentstart " + data.getString("value"));
                LocalDate rentStart = LocalDate.parse(data.getString("value"), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                rent.setRent_start(rentStart);
                break;
            case "rent_end_planned":
                System.out.println("updating rentendplanned " + data.getString("value"));
                LocalDate rentEndPlanned = LocalDate.parse(data.getString("value"), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                rent.setRent_end_planned(rentEndPlanned);
                break;
            case "rent_end_actual":
                LocalDate rentEndActual = LocalDate.parse(data.getString("value"), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                rent.setRent_end_actual(rentEndActual);
                break;
            case "note":
                rent.setNote(data.getString("value"));
                break;
            case "status":
                RentStatusEnum status = RentStatusEnum.valueOf(data.getString("value"));
                rent.setStatus(status);
                break;
            default:
                throw new CCException(1106, "Property not found: " + property);
        }

        /*em.merge(rent);*/

        rentSocket.broadcast();
    }

    //region setter
    public void setStudent(Long rentId, long studentId) {
        Student student = em.find(Student.class, studentId);
        Rent rent = getById(rentId);
        rent.setStudent(student);
    }

    public void setTeacherStart(Long rentId, long teacherId) {
        Teacher teacher = em.find(Teacher.class, teacherId);
        Rent rent = getById(rentId);
        rent.setTeacher_start(teacher);
    }

    public void setTeacherEnd(Long rentId, long teacherId) {
        Teacher teacher = em.find(Teacher.class, teacherId);
        Rent rent = getById(rentId);
        rent.setTeacher_end(teacher);
    }

    public void setDevice(Long rentId, long deviceId) {
        Device device = em.find(Device.class, deviceId);
        Rent rent = getById(rentId);
        rent.setDevice(device);
    }

    public void setRentStart(Long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_start(LocalDate.parse(date));
    }

    public void setRentEndPlanned(Long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_end_planned(LocalDate.parse(date));
    }

    public void setRentEndActual(Long rentId, String date) {
        Rent rent = getById(rentId);
        rent.setRent_end_actual(LocalDate.parse(date));
    }

    public void updateStatus(Long rentId, String status) {
        Rent rent = getById(rentId);
        rent.setStatus(RentStatusEnum.valueOf(status));
    }

    public void setNote(Long rentId, String note) {
        Rent rent = getById(rentId);
        rent.setNote(note);
    }

    public void setAccessory(Long rentId, String accessory) {
        Rent rent = getById(rentId);
        rent.setAccessory(accessory);
    }
    public void setDeviceString(Long rentId, String device_string) {
        Rent rent = getById(rentId);
        rent.setDevice_string(device_string);
    }
    public void updateStatus(Long rentId, RentStatusEnum verificationStatus){
        Rent rent = getById(rentId);

        if(rent.getStatus() == verificationStatus){
            throw new CCException(1201);
        }

        rent.setStatus(verificationStatus);
    }
    //endregion

    //region utility
    private boolean validateJsonKey(JsonObject jsonObject, String key){
        return (jsonObject.containsKey(key) && jsonObject.get(key) != null && jsonObject.get(key) != JsonValue.NULL);
    }
    //endregion


    public Response exportAllRents() {
        StreamingOutput stream = os -> {
            try (Writer writer = new BufferedWriter(new OutputStreamWriter(os))) {
                writer.write(getCSVHeader());

                List<RentDTO> rents = getAllSingleList();
                for (RentDTO rent : rents) {
                    String csvLine = buildCSVLine(rent);
                    writer.write(csvLine);
                }
            } catch (IOException e) {
                throw new CCException(1200, "File creation failed");
            }
        };

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm");

        return Response.ok(stream)
                .header("Content-Disposition", "attachment; filename=\"rent-" + dateFormat.format(new Date()) + ".csv\"")
                .build();
    }

    private String getCSVHeader() {
        return "rent_id;status;type;device_id;device_string;teacher_start_id;teacher_start_name;teacher_end_id;teacher_end_name;rent_start;rent_end_planned;rent_end_actual;student_id;student_name;note;verification_message;\n";
    }

    private String buildCSVLine(RentDTO rent) {
        StringBuilder line = new StringBuilder();
        line.append(rent.rent_id()).append(';')
                .append(rent.status()).append(';')
                .append(rent.type()).append(';')
                .append(rent.device().getDevice_id()).append(';')
                .append(rent.device_string()).append(';');

        Long teacherEndId = rent.teacher_end() != null ? rent.teacher_end().getTeacher_id() : null;
        String teacherEndName = rent.teacher_end() != null
                ? rent.teacher_end().getFirstname() + " " + rent.teacher_end().getLastname()
                : null;

        line.append(rent.teacher_start().getTeacher_id()).append(';')
                .append(rent.teacher_start().getFirstname()).append(' ').append(rent.teacher_start().getLastname()).append(';')
                .append(teacherEndId).append(';')
                .append(teacherEndName).append(';')
                .append(rent.rent_start()).append(';')
                .append(rent.rent_end_planned()).append(';')
                .append(rent.rent_end_actual()).append(';')
                .append(rent.student().getStudent_id()).append(';')
                .append(rent.student().getFirstname()).append(' ').append(rent.student().getLastname()).append(';')
                .append(rent.note()).append(';')
                .append(rent.verification_message()).append(";\n");

        return line.toString();
    }

    @Transactional
    public void importRents(File file){
        if(file == null) throw new CCException(1105);

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine();

            if(line == null || line.equals("")) throw new CCException(1203);
            String[] lineArray = line.split(";");
            if (lineArray.length <= 1) throw new CCException(1203);

            //removes characters like our friend \uFEFF a invisible zero space character added to csv files when opening excel that throws off my validations :)
            lineArray[0] = lineArray[0].replaceAll("[^a-zA-Z_-]", "");

            //checks if the csv file matches the required structure
            if(lineArray.length != 16) throw new CCException(1204, "invalid line length");

            while ((line = reader.readLine()) != null) {
                System.out.println(line);
                lineArray = line.split(";");
                if(lineArray.length != 16) break;

                Teacher teacherEnd = null;
                if(!lineArray[7].equals("null")){
                    teacherEnd = em.find(Teacher.class, lineArray[7]);
                }

                LocalDate rent_end_planned = null;
                if(!lineArray[10].equals("null")){
                    rent_end_planned = LocalDate.parse(lineArray[10]);
                }

                LocalDate rent_end_actual = null;
                if(!lineArray[11].equals("null")){
                    rent_end_actual = LocalDate.parse(lineArray[11]);
                }

                Rent rent = new Rent(Long.valueOf(lineArray[0]),
                    RentStatusEnum.valueOf(lineArray[1]), RentTypeEnum.valueOf(lineArray[2]),
                    em.find(Device.class, lineArray[3]), lineArray[4],
                    em.find(Teacher.class, lineArray[5]), teacherEnd,
                    LocalDate.parse(lineArray[9]), rent_end_planned, rent_end_actual,
                    em.find(Student.class, lineArray[12]),
                    lineArray[14], lineArray[15]);

                em.persist(rent);
            }
        } catch (IOException e) {
            throw new CCException(1204, "File could not be read");
        }
    }
}
