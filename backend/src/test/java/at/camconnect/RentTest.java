package at.camconnect;

import at.camconnect.model.Rent;
import at.camconnect.repository.StudentRepository;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.time.LocalDate;

import static io.restassured.RestAssured.given;

public class RentTest {
    JsonObject student1 = Json.createObjectBuilder().add("firstname", "Yanik").add("lastname", "Kendler").add("school_class", "4BHITM").add("password", "1234").add("user_id", "it200272").build();
    JsonObject student2 = Json.createObjectBuilder().add("firstname", "Leon").add("lastname", "Steinhuber").add("school_class", "4BHITM").add("password", "1234").add("user_id", "it200273").build();
    JsonObject teacher1 = Json.createObjectBuilder().add("firstname", "Erich").add("lastname", "Baar").add("verification", "").add("password", "1234").add("user_id", "it200274").build();
    JsonObject device1 = Json.createObjectBuilder().add("serial", "Camera").add("note", "nothing").build();

    @Test
    public void testAddRent() {
        given()
                .contentType("application/json")
                .when()
                .body(student1.toString())
                .post("student/create")
                .then()
                .statusCode(200);

        given()
                .contentType("application/json")
                .when()
                .body(student2.toString())
                .post("student/create")
                .then()
                .statusCode(200);
    }
}
