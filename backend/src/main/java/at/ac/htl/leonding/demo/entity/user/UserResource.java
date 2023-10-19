package at.ac.htl.leonding.demo.entity.user;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;

@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {
    @Inject UserRepository userRepository;
    @Inject UserMapper userMapper;
    @GET
    public List<UserDto> getUsers() {
        return userRepository.getAll().stream().map(user -> userMapper.toResource(user)).collect(Collectors.toList());
    }
    
    @GET
    @Path("/{id:[0-9]+}")
    public UserDto get(@PathParam("id") int id) {
        return userMapper.toResource(userRepository.get(id));
    }
    @POST
    @Transactional
    public Response save(UserDto user) {
        var savedUser = userRepository.insert(userMapper.fromResource(user));
        var uri = UriBuilder.fromResource(UserResource.class).path(Integer.toString(savedUser.getId()).toString()).build();
        return Response.created(uri).build();
    }
}
