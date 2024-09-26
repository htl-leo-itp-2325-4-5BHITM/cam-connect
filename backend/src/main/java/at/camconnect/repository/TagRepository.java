package at.camconnect.repository;

import at.camconnect.dtos.AutocompleteNumberOptionDTO;
import at.camconnect.model.Tag;
import at.camconnect.responseSystem.CCException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.LinkedList;
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

    public List<AutocompleteNumberOptionDTO<Tag>> search(String searchTerm){
        List<Tag> tags = new LinkedList<Tag>();

        tags = entityManager.createQuery(
                        "SELECT t FROM Tag t " +
                                "WHERE UPPER(t.name) LIKE :searchTerm " +
                                "order by name",
                        Tag.class)
                .setParameter("searchTerm", "%" + searchTerm.toUpperCase() + "%")
                .getResultList();

        List<AutocompleteNumberOptionDTO<Tag>> result = new LinkedList<>();

        for (Tag tag : tags) {
            result.add(new AutocompleteNumberOptionDTO<>(tag, tag.getTag_id()));
        }

        return result;
    }
}
