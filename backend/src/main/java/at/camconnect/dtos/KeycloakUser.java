package at.camconnect.dtos;


import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public class KeycloakUser {
    @JsonProperty("id")
    public String id;
    @JsonProperty("username")
    public String username;
    @JsonProperty("firstName")
    public String firstName;
    @JsonProperty("lastName")
    public String lastName;
    @JsonProperty("email")
    public String email;
    @JsonProperty("emailVerified")
    public boolean emailVerified;
    @JsonProperty("attributes")
    public Attributes attributes;
    @JsonProperty("createdTimestamp")
    public long createdTimestamp;
    @JsonProperty("enabled")
    public boolean enabled;
    @JsonProperty("totp")
    public boolean totp;
    @JsonProperty("federationLink")
    public String federationLink;
    @JsonProperty("disableableCredentialTypes")
    public List<String> disableableCredentialTypes;
    @JsonProperty("requiredActions")
    public List<String> requiredActions;
    @JsonProperty("notBefore")
    public int notBefore;
    @JsonProperty("access")
    public Access access;

    public static class Attributes {
        @JsonProperty("LDAP_ENTRY_DN")
        public List<String> ldapEntryDn;
        @JsonProperty("objectGUID")
        public List<String> objectGuid;
        @JsonProperty("distinguishedName")
        public List<String> distinguishedName;
        @JsonProperty("objectSid")
        public List<String> objectSid;
        @JsonProperty("LDAP_ID")
        public List<String> ldapId;
        @JsonProperty("createTimestamp")
        public List<String> createTimestamp;
        @JsonProperty("modifyTimestamp")
        public List<String> modifyTimestamp;
    }

    public static class Access {
        @JsonProperty("manageGroupMembership")
        public boolean manageGroupMembership;
        @JsonProperty("view")
        public boolean view;
        @JsonProperty("mapRoles")
        public boolean mapRoles;
        @JsonProperty("impersonate")
        public boolean impersonate;
        @JsonProperty("manage")
        public boolean manage;
    }
}
