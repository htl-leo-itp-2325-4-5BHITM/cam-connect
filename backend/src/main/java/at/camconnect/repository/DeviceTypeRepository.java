package at.camconnect.repository;

import at.camconnect.dtos.*;
import at.camconnect.dtos.deviceType.*;
import at.camconnect.enums.DeviceTypeStatusEnum;
import at.camconnect.model.DeviceTypeAttributes.*;
import at.camconnect.model.Tag;
import at.camconnect.responseSystem.CCException;
import at.camconnect.enums.DeviceTypeVariantEnum;
import at.camconnect.model.DeviceType;
import at.camconnect.model.DeviceTypeVariants.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import org.hibernate.exception.ConstraintViolationException;

import java.io.*;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@ApplicationScoped
public class DeviceTypeRepository {
    @Inject
    EntityManager em;

    @Inject
    DeviceTypeAttributeRepository deviceTypeAttributeRepository;

    public DeviceType create(DeviceTypeVariantEnum typeEnum, JsonObject data){
        /* Why JsonData and not DTO
         * We use a single create endpoint to create lots of different types: this makes the process when calling
         * the api very easy. If we were to use a DTO here we would either have to hardcode all the different routes, or
         * switch case through the typeEnum and create a different entity with different params for each, this would then
         * require a factory or a abstract create method that returns a instance.
         */

        DeviceType deviceType = null;

        //use quarkus's built in object mapper to create a entity from the provided json
        String dataString = String.valueOf(data);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            deviceType = objectMapper.readValue(dataString, enumToClass(typeEnum));
        } catch (JsonProcessingException e) {
            throw new CCException(1106, e.getMessage());
        }

        em.persist(deviceType);
        return deviceType;
    }

    public DeviceType getById(Long id) {
        DeviceType deviceType = em.find(DeviceType.class, id);
        if (deviceType == null) throw new CCException(1101);
        return deviceType;
    }

    public DeviceTypeCollection getAll(){
        List<CameraType> cameraTypes = em.createQuery("SELECT d FROM CameraType d WHERE d.status != :status", CameraType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<DroneType> droneTypes = em.createQuery("SELECT d FROM DroneType d where d.status != :status", DroneType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<LensType> lensTypes = em.createQuery("SELECT d FROM LensType d where d.status != :status", LensType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<LightType> lightTypes = em.createQuery("SELECT d FROM LightType d where d.status != :status", LightType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<MicrophoneType> microphoneTypes = em.createQuery("SELECT d FROM MicrophoneType d where d.status != :status", MicrophoneType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<StabilizerType> stabilizerTypes = em.createQuery("SELECT d FROM StabilizerType d where d.status != :status", StabilizerType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();
        List<TripodType> tripodTypes = em.createQuery("SELECT d FROM TripodType d where d.status != :status", TripodType.class).setParameter("status", DeviceTypeStatusEnum.disabled).getResultList();

        return new DeviceTypeCollection(cameraTypes, droneTypes, lensTypes, lightTypes, microphoneTypes, stabilizerTypes, tripodTypes);
    }

    public List<AutocompleteOptionDTO<DeviceTypeMinimalDTO>> search(String searchTerm){
        List<DeviceTypeMinimalDTO> deviceTypes = new LinkedList<DeviceTypeMinimalDTO>();

        deviceTypes = em.createQuery(
                        "SELECT new at.camconnect.dtos.deviceType.DeviceTypeMinimalDTO(d.id, d.variant, d.name, d.image_blob_url) FROM DeviceType d " +
                                "WHERE UPPER(d.name) LIKE :searchTerm " +
                                "order by name",
                        DeviceTypeMinimalDTO.class)
                .setParameter("searchTerm", "%" + searchTerm.toUpperCase() + "%")
                .getResultList();

        List<AutocompleteOptionDTO<DeviceTypeMinimalDTO>> result = new LinkedList<>();

        for (DeviceTypeMinimalDTO deviceType : deviceTypes) {
            result.add(new AutocompleteOptionDTO<>(deviceType, deviceType.type_id()));
        }

        return result;
    }

    public List<DeviceTypeFullDTO> getAllFull() {
        List<DeviceType> deviceTypeList = em.createQuery("select dt from DeviceType dt where dt.status = 'active'", DeviceType.class).getResultList();

        List<DeviceTypeFullDTO> list = new LinkedList<>();
        for(DeviceType deviceType : deviceTypeList){
            Long availableDevices = em.createQuery(
                     "select coalesce(count(d), 0) from Device d " +
                        "where d.device_id not in (select r.device.device_id from Rent r where r.status != 'CREATED' and r.status != 'RETURNED')" +
                        "group by d.type.type_id " +
                        "having d.type.type_id = :type_id", Long.class)
                    .setParameter("type_id", deviceType.getType_id())
                    .getResultStream().findFirst().orElse(0L);

            List<Tag> tagList = em.createQuery(
                     "SELECT t FROM Tag t " +
                        "JOIN FETCH t.types dt " +
                        "WHERE dt = :deviceType", Tag.class)
                    .setParameter("deviceType", deviceType)
                    .getResultList();

            list.add(new DeviceTypeFullDTO(deviceType, availableDevices.intValue(), tagList));
        }
        return list;
    }

    public void remove(Long id){
        DeviceType deviceType = getById(id);
        deviceType.setStatus(DeviceTypeStatusEnum.disabled);
        em.merge(deviceType);
    }

    /**
     * replaces the data in a devicetype with the passed data
     * @param id
     * @param data
     * @return
     */
    public DeviceType update(Long id, DeviceTypeGlobalIdDTO data){
        DeviceType deviceType = getById(id); //should result in a child of DeviceType like CameraType

        deviceType.setName(data.name());
        deviceType.setImage_blob_url(data.image());

        //The DeviceTypeDTO is converted into a DeviceType global which contains objects instead of ids
        DeviceTypeGlobalObjectsDTO dataWithObjects = new DeviceTypeGlobalObjectsDTO(
                data.type_id(),
                data.name(),
                data.image(),
                data.autofocus(),
                data.f_stop(),
                data.focal_length(),
                data.height_centimeters(),
                data.max_weight_kilograms(),
                data.max_range(),
                data.flight_time(),
                data.requires_license(),
                data.needs_recorder(),
                data.needs_power(),
                data.number_of_axis(),
                data.rgb(),
                data.variable_temperature(),
                data.watts(),
                em.find(AudioConnector.class, data.connector_id()),
                em.find(TripodHead.class, data.head_id()),
                em.find(LensMount.class, data.mount_id()),
                em.find(CameraSystem.class, data.system_id()),
                data.description()
        );

        //just call the update method on whichever child class it is
        deviceType.update(dataWithObjects);
        return deviceType;
    }

    //region utility functions
    private Class<? extends DeviceType> enumToClass(DeviceTypeVariantEnum typeEnum) {
        //yes there are breaks missing, but they are unnecessary because of the returns
        switch (typeEnum) {
            case microphone:
                return MicrophoneType.class;
            case camera:
                return CameraType.class;
            case drone:
                return DroneType.class;
            case lens:
                return LensType.class;
            case light:
                return LightType.class;
            case stabilizer:
                return StabilizerType.class;
            case tripod:
                return TripodType.class;
        }

        throw new CCException(1104);
    }

    //basically a wrapper for em.find but filters out nulls
    private <T> T getAttribute(Class<T> type, Long id){
        if(id == null) return null;
        return em.find(type, id);
    }

    //endregion

    public Response exportAllDeviceTypeVariants() {
        StreamingOutput stream = os -> {
            try (Writer writer = new BufferedWriter(new OutputStreamWriter(os))) {
                writer.write("type_id; name; image; autofocus; f_stop; focal_length; height_centimeters; max_range; max_weight_kilograms; needs_recorder; number_of_axis; rgb; variable_temperature; watts; needs_power; wireless; head_id; mount_id; resolution_id; sensor_id; system; flight_time_minutes; description\n");

                List<DeviceTypeFullDTO> deviceTypeList = getAllFull();
                for (DeviceTypeFullDTO deviceType : deviceTypeList) {
                    try {
                        writer.write(deviceType.deviceType().toGlobalDTO().toCsvString());
                        System.out.println(deviceType.deviceType().toGlobalDTO().toCsvString());
                    }catch (Exception ex){
                        ex.printStackTrace();
                    }
                }
            } catch (IOException e) {
                throw new CCException(1200);
            }
        };

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm");

        return Response.ok(stream)
                .header("Content-Disposition", "attachment; filename=\"camconnect_devicetype-export_" + dateFormat.format(new Date()) + ".csv\"")
                .build();
    }

    public Response exportDeviceTypeVariant(DeviceTypeVariantEnum variant) {
        StreamingOutput stream = os -> {
            try (Writer writer = new BufferedWriter(new OutputStreamWriter(os))) {
                writer.write("type_id; name; image; autofocus; f_stop; focal_length; height_centimeters; max_range; max_weight_kilograms; needs_recorder; number_of_axis; rgb; variable_temperature; watts; needs_power; wireless; head_id; mount_id; resolution_id; sensor_id; system; flight_time_minutes; description");

                List<DeviceTypeFullDTO> deviceTypeList = getAllFull();
                for (DeviceTypeFullDTO deviceType : deviceTypeList) {
                    writer.write(deviceType.deviceType().toGlobalDTO().toCsvString());
                }
            } catch (IOException e) {
                throw new CCException(1200);
            }
        };

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm");

        return Response.ok(stream)
                .header("Content-Disposition", "attachment; filename=\"camconnect_devicetype-export_" + dateFormat.format(new Date()) + ".csv\"")
                .build();
    }

    private String getCSVHeader(String type) {
        String base = "type_id;creation_date;name;image;status;variant;";
        return base + switch(type){
            case "camera" -> "sensor_id;resolution_id;mount_id;system;autofocus;\n";
            case "drone" -> "sensor_id;resolution_id;max_range;\n";
            case "lens" -> "f_stop;mount_id;focal_length;\n";
            case "light" -> "watts;rgb;variable_temperature;\n";
            case "microphone" -> "needs_power;wireless;needs_recorder;\n";
            case "stabilizer" ->"max_weight_kilograms;number_of_axis;\n";
            case "tripod" -> "height_centimeters;head_id;\n";
            case "simple" -> "description;\n";
            default -> "";
        };
    }

    @Transactional
    public void importDeviceTypes(File file, String type) {
        if (file == null) throw new CCException(1105);

        HashMap<Integer, List<String>> typeMap = new HashMap<>() {{
            put(26, new LinkedList<>(List.of("all")));
            put(12, new LinkedList<>(List.of("camera")));
            put(9, new LinkedList<>(List.of("drone", "lens", "light", "microphone")));
            put(8, new LinkedList<>(List.of("stabilizer", "tripod")));
            put(7, new LinkedList<>(List.of("simple")));
        }};

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine();
            if (line == null || line.isEmpty()) throw new CCException(1203);

            String[] lineArray = line.split(";");
            int headerLength = lineArray.length;

            if(!typeMap.get(headerLength).contains(type)) throw new CCException(1204);

            if (headerLength <= 1) throw new CCException(1203);

            //removes characters like our friend \uFEFF a invisible zero space character added to csv files when opening excel that throws off my validations :)
            lineArray[0] = lineArray[0].replaceAll("[^a-zA-Z_-]", "");

            while ((line = reader.readLine()) != null) {
                lineArray = line.split(";");

                if (lineArray.length != headerLength) throw new CCException(1204, lineArray[0] + " has no valid structure");

                try {
                    String currType = type;
                    if(Objects.equals(type, "all")){
                        currType = lineArray[5];

                        switch(currType){
                            case "simple": lineArray[6] = lineArray[25]; break;
                            case "drone": lineArray[8] = lineArray[12]; break;
                            case "lens": lineArray[6] = lineArray[8]; lineArray[7] = lineArray[13]; lineArray[8] = lineArray[14]; break;
                            case "light": lineArray[6] = lineArray[15]; lineArray[7] = lineArray[16]; lineArray[8] = lineArray[17]; break;
                            case "microphone": lineArray[6] = lineArray[18]; lineArray[7] = lineArray[19]; lineArray[8] = lineArray[20]; break;
                            case "stabilizer":  lineArray[6] = lineArray[21]; lineArray[7] = lineArray[22]; break;
                        }
                    }

                    System.out.println(currType);
                    System.out.println(line);
                    for (int i = 0; i < lineArray.length; i++) {
                        System.out.print(lineArray[i] + "-");
                    }
                    DeviceType deviceType = getDeviceTypeByLineArray(lineArray, currType);
                    em.persist(deviceType);

                } catch(NumberFormatException ex){
                    throw new CCException(1106, "Wrong data type in the import file: " + ex.getMessage());
                } catch(ConstraintViolationException ex){
                    throw new CCException(1201, "One device type does already exist " + ex.getMessage());
                } catch(IllegalArgumentException | ArrayIndexOutOfBoundsException ex){
                    throw new CCException(1204, ex.getMessage());
                }
            }
        } catch (IOException e) {
            throw new CCException(1204, "File could not be read");
        }
    }

    public DeviceType getDeviceTypeByLineArray(String[] lineArray, String type) {
        /*return switch (type) {
            case "camera" -> new CameraType(
                    parseLong(lineArray[0]), parseDate(lineArray[1]), lineArray[2], lineArray[3],
                    parseEnum(DeviceTypeStatusEnum.class, lineArray[4]), parseEnum(DeviceTypeVariantEnum.class, lineArray[5]),
                    findEntity(CameraSensor.class, lineArray[6]),
                    findEntity(CameraResolution.class, lineArray[7]),
                    findEntity(LensMount.class, lineArray[8]),
                    findEntity(CameraSystem.class, lineArray[9]),
                    parseInt(lineArray[10]),
                    parseBoolean(lineArray[11])
            );
            case "drone" -> new DroneType(
                    parseLong(lineArray[0]), parseDate(lineArray[1]), lineArray[2], lineArray[3],
                    parseEnum(DeviceTypeStatusEnum.class, lineArray[4]), parseEnum(DeviceTypeVariantEnum.class, lineArray[5]),
                    findEntity(CameraSensor.class, lineArray[6]),
                    findEntity(CameraResolution.class, lineArray[7]),
                    parseInt(lineArray[8])
            );
            case "lens" -> new LensType(
                    parseLong(lineArray[0]), parseDate(lineArray[1]), lineArray[2], lineArray[3],
                    parseEnum(DeviceTypeStatusEnum.class, lineArray[4]), parseEnum(DeviceTypeVariantEnum.class, lineArray[5]),
                    findEntity(LensMount.class, lineArray[6]),
                    lineArray[7],
                    lineArray[8]
            );
            case "light" -> new LightType(
                    parseLong(lineArray[0]), parseDate(lineArray[1]), lineArray[2], lineArray[3],
                    parseEnum(DeviceTypeStatusEnum.class, lineArray[4]), parseEnum(DeviceTypeVariantEnum.class, lineArray[5]),
                    parseInt(lineArray[6]),
                    parseBoolean(lineArray[7]),
                    parseBoolean(lineArray[8])
            );
            case "microphone" -> new MicrophoneType(
                    parseLong(lineArray[0]), parseDate(lineArray[1]), lineArray[2], lineArray[3],
                    parseEnum(DeviceTypeStatusEnum.class, lineArray[4]), parseEnum(DeviceTypeVariantEnum.class, lineArray[5]),
                    parseBoolean(lineArray[6]),
                    parseBoolean(lineArray[7]),
                    parseBoolean(lineArray[8])
            );
            case "simple" -> new SimpleType(
                    parseLong(lineArray[0]), parseDate(lineArray[1]), lineArray[2], lineArray[3],
                    parseEnum(DeviceTypeStatusEnum.class, lineArray[4]), parseEnum(DeviceTypeVariantEnum.class, lineArray[5]),
                    lineArray[6]
            );
            case "stabilizer" -> new StabilizerType(
                    parseLong(lineArray[0]), parseDate(lineArray[1]), lineArray[2], lineArray[3],
                    parseEnum(DeviceTypeStatusEnum.class, lineArray[4]), parseEnum(DeviceTypeVariantEnum.class, lineArray[5]),
                    parseDouble(lineArray[6]),
                    parseInt(lineArray[7])
            );
            case "tripod" -> new TripodType(
                    parseLong(lineArray[0]), parseDate(lineArray[1]), lineArray[2], lineArray[3],
                    parseEnum(DeviceTypeStatusEnum.class, lineArray[4]), parseEnum(DeviceTypeVariantEnum.class, lineArray[5]),
                    parseInt(lineArray[6]),
                    findEntity(TripodHead.class, lineArray[7])
            );
            default -> null;
        };*/
        return null;
    }

    private Long parseLong(String value) {
        return Long.valueOf(value);
    }

    private LocalDateTime parseDate(String value) {
        return !Objects.equals(value, "null") ? LocalDateTime.parse(value) : null;
    }

    private <T extends Enum<T>> T parseEnum(Class<T> enumType, String value) {
        return !Objects.equals(value, "null") ? Enum.valueOf(enumType, value) : null;
    }

    private <T> T findEntity(Class<T> entityClass, String value) {
        return !Objects.equals(value, "null") ? em.find(entityClass, value) : null;
    }

    private Integer parseInt(String value) {
        return Integer.parseInt(value);
    }

    private Boolean parseBoolean(String value) {
        return Boolean.parseBoolean(value);
    }

    private Double parseDouble(String value) {
        return Double.parseDouble(value.replaceAll(",", "."));
    }

}
