package at.camconnect;

import at.camconnect.model.Rent;
import at.camconnect.repository.StudentRepository;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.MockMailbox;
import io.vertx.ext.mail.MailMessage;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class RentTest {
    JsonObject student1 = Json.createObjectBuilder().add("firstname", "Yanik").add("lastname", "Kendler").add("school_class", "4BHITM").add("password", "1234").add("user_id", "it200272").build();
    JsonObject teacher1 = Json.createObjectBuilder().add("firstname", "Erich").add("lastname", "Baar").add("verification", "").add("password", "1234").add("user_id", "it200274").build();
    JsonObject device1 = Json.createObjectBuilder().add("serial", "Camera").add("note", "nothing").build();
    JsonObject rent1 = Json.createObjectBuilder().add("student_id", 1).add("rent_start", " ").add("rent_end_planned", " ").add("rent_end_actual", " ").build();
    JsonObject rentUpdate = Json.createObjectBuilder().add("rent_id", 1).add("device_id", 1).add("student_id", 1).add("teacher_id", 1).add("rent_start", " ").add("rent_end_planned", " ").add("rend_end_actual", " ").add("notes", "Er hat noch zusaätzlich einen Reflektor mit.").build();

    @Test
    public void testCreateRent() {
        given()
                .contentType("application/json")
                .when()
                .body(student1.toString())
                .post("api/student/create")
                .then()
                .statusCode(200);

        given()
                .contentType("application/json")
                .when()
                .body(rent1.toString())
                .post("api/rent/create")
                .then()
                .statusCode(200);
    }

    @Test
    public void testUpdateRent() {
        given()
                .contentType("application/json")
                .when()
                .body(teacher1.toString())
                .post("api/teacher/create")
                .then()
                .statusCode(200);

        given()
                .contentType("application/json")
                .when()
                .body(student1.toString())
                .post("api/student/create")
                .then()
                .statusCode(200);

        given()
                .contentType("application/json")
                .when()
                .body(device1.toString())
                .post("api/device/create")
                .then()
                .statusCode(200);

        given()
                .contentType("application/json")
                .when()
                .body(rent1.toString())
                .post("api/rent/create")
                .then()
                .statusCode(200);

        given()
                .contentType("application/json")
                .when()
                .body(rentUpdate.toString())
                .post("api/rent/getbyid/0/update")
                .then()
                .statusCode(200);
    }

    @Test
    void testIfMailIsSend() {
        // call a REST endpoint that sends email
        given()
                .when()
                .get("/api/rent/getbyid/0/sendconfirmation/it200269")
                .then()
                .statusCode(202)
                .body(is("OK"));
    }
}
