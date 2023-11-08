package at.camconnect;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

public class TeacherTest {
    JsonObject teacher1 = Json.createObjectBuilder().add("firstname", "Erich").add("lastname", "Baar").add("verification", "").add("password", "1234").add("user_id", "it200272").build();
    JsonObject teacher2 = Json.createObjectBuilder().add("firstname", "Martin").add("lastname", "Huemer").add("verification", "").add("password", "1234").add("user_id", "it200273").build();

    @Test
    public void testAddTeachers() {
        given()
                .contentType("application/json")
                .when()
                .body(teacher1.toString())
                .post("teacher/create")
                .then()
                .statusCode(200);
    }

    @Test
    public void testSearchTeacher() {

    }
}
