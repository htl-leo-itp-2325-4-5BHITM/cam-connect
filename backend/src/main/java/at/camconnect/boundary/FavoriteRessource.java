package at.camconnect.boundary;

import at.camconnect.model.Device;
import at.camconnect.model.Favorite;
import at.camconnect.repository.FavoriteRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/favorite")
public class FavoriteRessource {
    @Inject
    FavoriteRepository favoriteRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createFavorite(Favorite f){
        favoriteRepository.add(f);
        return Response.ok().build();
    }

    @POST
    @Path("/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deleteFavorite(Favorite f){
        favoriteRepository.remove(f);
        return Response.ok().build();
    }

    @POST
    @Path("/update/{id: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateFavorite(Favorite f){
        favoriteRepository.update(f);
        return Response.ok().build();
    }
    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Favorite getById(@PathParam("id")long id) {
        return favoriteRepository.getById(id);
    }

    @GET
    @Path("/getall")
    public List<Favorite> getAll() {
        return favoriteRepository.getAll();
    }

}
