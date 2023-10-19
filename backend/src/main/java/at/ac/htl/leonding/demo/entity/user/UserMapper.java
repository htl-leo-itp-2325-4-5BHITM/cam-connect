package at.ac.htl.leonding.demo.entity.user;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserMapper {
    public UserDto toResource(User user) {
        return new UserDto(user.getId(), user.getName());
    }
    public User fromResource(UserDto dto) {
        var user = new User();
        user.setId(dto.id());
        user.setName(dto.name());
        return user;
    }
}
