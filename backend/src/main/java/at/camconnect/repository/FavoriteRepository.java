package at.camconnect.repository;

import at.camconnect.model.Favorite;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

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
    public void update(long id){
        Favorite fav = em.find(Favorite.class, id);

        em.remove(fav);
    }
}
