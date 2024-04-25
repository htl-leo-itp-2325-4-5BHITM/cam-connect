package at.camconnect;

import at.camconnect.model.Device;
import at.camconnect.repository.DeviceRepository;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;

public class DeviceTest {
    JsonObject device1 = Json.createObjectBuilder().add("note", "").add("serial", "sony").build();

    Long createdDeviceId;

    @BeforeAll
    public void setUp() {
        // Annahme: Ein Gerät wird erstellt und die ID wird gespeichert
        Device device = new Device();

        createdDeviceId =
                given()
                        .contentType("application/json")
                        .body(device)
                        .when()
                        .post("/device/create")
                        .then()
                        .statusCode(200)
                        .extract()
                        .path("id");
    }

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
    @Test
    public void testGetDeviceById_DeviceFound() {
        // GET-Anfrage für das Gerät mit der erstellten ID und Überprüfung des Statuscodes
        given()
                .pathParam("id", createdDeviceId)
                .when()
                .get("/device/{id}")
                .then()
                .statusCode(200)
                .body("id", equalTo(createdDeviceId)); // Annahme: Die Antwort enthält die ID des Geräts
    }

    @Test
    public void testGetDeviceById_DeviceNotFound() {
        // Annahme: Eine ID eines nicht vorhandenen Geräts
        Long nonExistentDeviceId = 999L;

        // GET-Anfrage für das Gerät mit der angegebenen ID und Überprüfung des Statuscodes
        given()
                .pathParam("id", nonExistentDeviceId)
                .when()
                .get("/device/{id}")
                .then()
                .statusCode(404); // Annahme: Nicht gefunden-Statuscode wird zurückgegeben
    }

}
