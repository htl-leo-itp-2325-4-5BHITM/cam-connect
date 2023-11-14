package at.camconnect.repository;

import at.camconnect.model.Device;
import at.camconnect.model.Tag;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;

@ApplicationScoped
public class TagRepository {
    @Inject
    EntityManager entityManager;

    public void addTag(Tag tag){
        entityManager.persist(tag);
    }
    public void deleteTag(Tag tag){
        entityManager.remove(tag);
    }
    public void updateTag(Tag tag){
        entityManager.merge(tag);
    }

    public Tag getTagById(long id){
        return entityManager.find(Tag.class, id);
    }
    public List<Tag> getAll(){
        List<Tag> rents = entityManager.createQuery("SELECT t FROM Tag t", Tag.class).getResultList();
        return rents;
    }
}
