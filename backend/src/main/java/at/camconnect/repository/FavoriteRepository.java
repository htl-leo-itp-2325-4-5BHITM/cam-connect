package at.camconnect.repository;

import at.camconnect.model.Device;
import at.camconnect.model.Favorite;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class FavoriteRepository {

    @Inject
    EntityManager em;

    @Transactional
    public void add(Favorite fav){
        em.persist(fav);
    }
    @Transactional
    public void remove(Favorite fav){
        em.remove(fav);
    }
    @Transactional
    public void update(Favorite fav){
        em.merge(fav);
    }
    public List<Favorite> getAll(){
        List<Favorite> favs = em.createQuery("SELECT f FROM Favorite f", Favorite.class).getResultList();
        return favs;
    }
    public Favorite getById(long id){
        return em.find(Favorite.class, id);
    }
}
