package at.camconnect;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

public class DeviceTest {
    JsonObject device1 = Json.createObjectBuilder().add("note", "").add("serial", "sony").build();

    @Test
    public void testAddStudent() {
        given()
                .contentType("application/json")
                .when()
                .body(device1.toString())
                .post("device/create")
                .then()
                .statusCode(200);
    }
}
