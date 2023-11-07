package at.camconnect;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;

public class StudentTest {
    JsonObject student1 = Json.createObjectBuilder().add("vorname", "Yanik").add("nachname", "Kendler").build();
    JsonObject student2 = Json.createObjectBuilder().add("vorname", "Leon").add("nachname", "Steinhuber").build();

    @Test
    public void testAddStudent(){
        given()
                .contentType("application/json")
                .when()
                .body(student1.toString())
                .post("student/create")
                .then()
                .statusCode(200);
    }
}
