package at.camconnect.repository;

import at.camconnect.model.Device;
import at.camconnect.model.Tag;
import at.camconnect.responseSystem.CCException;
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

    public Tag getById(long id){
        Tag tag = entityManager.find(Tag.class, id);
        if (tag == null) throw new CCException(1101);
        return tag;
    }

    public List<Tag> getAll(){
        List<Tag> tags = entityManager.createQuery("SELECT t FROM Tag t", Tag.class).getResultList();
        return tags;
    }
}
