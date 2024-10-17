package at.camconnect.repository;

import at.camconnect.dtos.deviceSet.DeviceSetCreateDTO;
import at.camconnect.dtos.deviceSet.DeviceSetFullDTO;
import at.camconnect.dtos.filters.DeviceTypeFilters;
import at.camconnect.model.Device;
import at.camconnect.model.DeviceSet;
import at.camconnect.model.DeviceType;
import at.camconnect.model.Tag;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.LinkedList;
import java.util.List;

@ApplicationScoped
public class DeviceSetRepository {
    @Inject
    EntityManager em;

    @Inject
    DeviceTypeRepository deviceTypeRepository;

    public List<DeviceSet> getAll(){
        return em.createQuery(
                        "select ds from DeviceSet ds"
                        , DeviceSet.class)
                .getResultList();
    }

    public List<DeviceSetFullDTO> getAllFull(DeviceTypeFilters filters){
        System.out.println(filters);
        List<DeviceSet> sets = em.createQuery(
                        "select ds from DeviceSet ds " +
                                "where ds.status = 'active' " +
                                "and upper(ds.name) like :name"
                        , DeviceSet.class)
                .setParameter("name", "%" + filters.searchTerm().toUpperCase() + "%")
                .getResultList();

        List<DeviceSetFullDTO> dtos = new LinkedList<>();

        for(DeviceSet set : sets) {
            boolean isTypeMatchingWithFilter = false;
            for(DeviceType type : set.getDevice_types()){
                if(deviceTypeRepository.isMatchingWithFilters(type, filters)){
                    isTypeMatchingWithFilter = true;
                    break;
                }
            }

            int availabilities = getAvailabilities(set);
            if(isTypeMatchingWithFilter){
                if(filters.onlyAvailable() && availabilities > 0) {
                    dtos.add(new DeviceSetFullDTO(set, availabilities));
                } else if(!filters.onlyAvailable()) {
                    dtos.add(new DeviceSetFullDTO(set, availabilities));
                }
            }

        }
        return dtos;
    }

    public int getAvailabilities(DeviceSet set){
        int minValue = Integer.MAX_VALUE;

        for(DeviceType deviceType : set.getDevice_types()) {
            Long availableDevices = em.createQuery(
                            "select coalesce(count(d), 0) from Device d " +
                                    "where d.device_id not in (select r.device.device_id from Rent r where r.status != 'CREATED' and r.status != 'RETURNED')" +
                                    "group by d.type.type_id " +
                                    "having d.type.type_id = :type_id", Long.class)
                    .setParameter("type_id", deviceType.getType_id())
                    .getResultStream().findFirst().orElse(0L);

            if(availableDevices < minValue) {
                minValue = availableDevices.intValue();
            }
        }

        if(minValue == Integer.MAX_VALUE) {
            return 0;
        }
        return minValue;
    }

    @Transactional
    public void create(DeviceSetCreateDTO dto){
        DeviceSet deviceSet = new DeviceSet(dto.name(), dto.description(), dto.status());
        em.persist(deviceSet);
        em.flush();

        if(dto.deviceTypeIds() != null) {
            for (Long deviceTypeId : dto.deviceTypeIds()) {
                DeviceType deviceType = em.find(DeviceType.class, deviceTypeId);
                deviceSet.getDevice_types().add(deviceType);
            }
        }

        if(dto.tags() != null) {
            for (Tag tag : dto.tags()) {
                deviceSet.getTags().add(tag);
            }
        }

        em.merge(deviceSet);
    }

    @Transactional
    public void update(DeviceSetCreateDTO dto) {
        DeviceSet deviceSet = em.find(DeviceSet.class, dto.id());
        deviceSet.setName(dto.name());
        deviceSet.setDescription(dto.description());
        deviceSet.setStatus(dto.status());
        deviceSet.getDevice_types().clear();

        if(dto.deviceTypeIds() == null) {
            em.merge(deviceSet);
            return;
        }
        for (Long deviceTypeId : dto.deviceTypeIds()) {
            DeviceType deviceType = em.find(DeviceType.class, deviceTypeId);
            deviceSet.getDevice_types().add(deviceType);
        }
        em.merge(deviceSet);
    }

    @Transactional
    public void delete(Long id) {
        DeviceSet deviceSet = em.find(DeviceSet.class, id);
        em.remove(deviceSet);
    }

    public void toggleTag(Long id, Long tagId) {
        DeviceSet deviceSet = em.find(DeviceSet.class, id);
        Tag tag = em.find(Tag.class, tagId);

        deviceSet.toggleTag(tag);

        em.merge(deviceSet);
    }
}
