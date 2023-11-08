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
import static org.hamcrest.CoreMatchers.is;

public class RentTest {
    JsonObject student1 = Json.createObjectBuilder().add("firstname", "Yanik").add("lastname", "Kendler").add("school_class", "4BHITM").add("password", "1234").add("user_id", "it200272").build();
    JsonObject teacher1 = Json.createObjectBuilder().add("firstname", "Erich").add("lastname", "Baar").add("verification", "").add("password", "1234").add("user_id", "it200274").build();
    JsonObject device1 = Json.createObjectBuilder().add("serial", "Camera").add("note", "nothing").build();
    JsonObject rent1 = Json.createObjectBuilder().add("student_id", "1").build();
    JsonObject rentUpdate = Json.createObjectBuilder().add("rent_id", 1).add("device_id", 1).add("student_id", 1).add("teacher_id", 1).add("rent_start", "").add("rent_end_planned", "").add("rend_end_actual", "").build();

    @Test
    public void testCreateRent() {
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
                .body(rent1.toString())
                .post("rent/create")
                .then()
                .statusCode(200);
    }

    @Test
    public void testUpdateRent() {
        given()
                .contentType("application/json")
                .when()
                .body(teacher1.toString())
                .post("teacher/create")
                .then()
                .statusCode(200);

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
                .body(device1.toString())
                .post("device/create")
                .then()
                .statusCode(200);

        given()
                .contentType("application/json")
                .when()
                .body(rent1.toString())
                .post("rent/create")
                .then()
                .statusCode(200);

        given()
                .contentType("application/json")
                .when()
                .body(rentUpdate.toString())
                .post("rent/update")
                .then()
                .statusCode(200);
    }
}
