package at.camconnect.repository;

import at.camconnect.dtos.deviceSet.DeviceSetCreateDTO;
import at.camconnect.model.DeviceSet;
import at.camconnect.model.DeviceType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class DeviceSetRepository {
    @Inject
    EntityManager em;

    public List<DeviceSet> getAll(){
        return em.createQuery("SELECT d FROM DeviceSet d order by d.id", DeviceSet.class).getResultList();
    }

    @Transactional
    public void create(DeviceSetCreateDTO dto){
        DeviceSet deviceSet = new DeviceSet(dto.name(), dto.description(), dto.status());
        em.persist(deviceSet);
        em.flush();

        if(dto.deviceTypeIds() == null) {
            return;
        }
        for (Long deviceTypeId : dto.deviceTypeIds()) {
            DeviceType deviceType = em.find(DeviceType.class, deviceTypeId);
            deviceSet.getDevice_types().add(deviceType);
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
}
