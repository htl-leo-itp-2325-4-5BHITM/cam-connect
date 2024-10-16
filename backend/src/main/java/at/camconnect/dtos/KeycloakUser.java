package at.camconnect.dtos;
import at.camconnect.enums.UserRoleEnum;
import com.fasterxml.jackson.annotation.JsonProperty;

public record KeycloakUser (
        String id,
        String username,
        @JsonProperty("firstName") String firstName,
        @JsonProperty("lastName") String lastName,
        String email,
        boolean emailVerified,
        Attributes attributes,
        long createdTimestamp,
        boolean enabled,
        boolean totp,
        String federationLink,
        String[] disableableCredentialTypes,
        String[] requiredActions,
        int notBefore,
        Access access
) {
    public record Attributes (
            @JsonProperty("LDAP_ENTRY_DN") String[] ldapEntryDn,
            @JsonProperty("locale") String[] locale,
            @JsonProperty("modifyTimestamp") String[] modifyTimestamp,
            @JsonProperty("createTimestamp") String[] createTimestamp,
            @JsonProperty("LDAP_ID") String[] ldapId
    ) {}

    public record Access (
            @JsonProperty("manageGroupMembership") boolean manageGroupMembership,
            @JsonProperty("view") boolean view,
            @JsonProperty("mapRoles") boolean mapRoles,
            @JsonProperty("impersonate") boolean impersonate,
            @JsonProperty("manage") boolean manage
    ) {}
}