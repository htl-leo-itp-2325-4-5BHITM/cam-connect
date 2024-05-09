package at.camconnect;

import at.camconnect.model.Device;
import at.camconnect.repository.DeviceRepository;
import jakarta.inject.Inject;
import jakarta.json.*;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;

public class DeviceTest {
    JsonObject device1 = Json.createObjectBuilder().add("note", "").add("serial", "sony").add("id", 1).build();

    @Inject
    EntityManager em;
    static Device device = new Device();
/*
    @BeforeAll
    public static void setUp() {
        // Annahme: Ein Gerät wird erstellt und die ID wird gespeichert

        device =
                given()
                        .contentType("application/json")
                        .body()
                        .when()
                        .post("/device/create")
                        .then()
                        .statusCode(200)
                        .extract()
                        .path("");
    }
*/
    @Test
    public void testGetDeviceById_DeviceFound() {
        // GET-Anfrage für das Gerät mit der erstellten ID und Überprüfung des Statuscodes
        given()
                .pathParam("id", device.getDevice_id())
                .when()
                .get("/device/getById/{id}")
                .then()
                .statusCode(200)
                .body("id", equalTo(device.getDevice_id())); // Annahme: Die Antwort enthält die ID des Geräts
    }

    @Test
    public void testGetDeviceById_DeviceNotFound() {
        // Annahme: Eine ID eines nicht vorhandenen Geräts
        Long nonExistentDeviceId = -3L;

        // GET-Anfrage für das Gerät mit der angegebenen ID und Überprüfung des Statuscodes
        given()
                .pathParam("id", nonExistentDeviceId)
                .when()
                .get("/device/{id}")
                .then()
                .statusCode(404);// Annahme: Nicht gefunden-Statuscode wird zurückgegeben
    }

    //getByNumberAndType
    @Test
    public void testGetDeviceByNumberAndType_DeviceFound() {
        // Arrange
        String number = "ABC123";
        Long typeId = device.getDevice_id(); // Annahme: Eine vorhandene Gerätetyp-ID

        // Act & Assert
        given()
                .queryParam("number", number)
                .queryParam("type_id", typeId)
                .when()
                .get("/device")
                .then()
                .statusCode(200)
                .body("number", equalTo(number));
        // Annahme: Die Antwort enthält die Gerätenummer (könnte weitere Assertions hinzufügen)
    }

    @Test
    public void testGetDeviceByNumberAndType_DeviceNotFound() {
        // Arrange
        String nonExistentNumber = "XYZ789";
        Long typeId = -3L; // Annahme: Eine vorhandene Gerätetyp-ID

        // Act & Assert
        given()
                .queryParam("number", nonExistentNumber)
                .queryParam("type_id", typeId)
                .when()
                .get("/device")
                .then()
                .statusCode(404);
    }
    @Test
    public void validateNumberAndType_DeviceFound(){
        // Arrange
        String number = "ABC123";
        Long typeId = device.getDevice_id(); // Annahme: Eine vorhandene Gerätetyp-ID

        // Act & Assert
        given()
                .queryParam("number", number)
                .queryParam("type_id", typeId)
                .when()
                .get("/device")
                .then()
                .statusCode(200)
                .body("number", equalTo(number));
        // Annahme: Die Antwort enthält die Gerätenummer
    }

}
