package at.camconnect;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

public class StudentTest {
    JsonObject student1 = Json.createObjectBuilder().add("name", "Yanik Kendler").add("school_class", "4BHITM").add("password", "1234").add("user_id", "it200272").build();
    JsonObject student2 = Json.createObjectBuilder().add("name", "Leon Steinhuber").add("school_class", "4BHITM").add("password", "1234").add("user_id", "it200273").build();

    @Test
    public void testAddStudent() {
        given()
                .contentType("application/json")
                .when()
                .body(student1.toString())
                .post("student/create")
                .then()
                .statusCode(200);
    }

    @Test
    public void testGetStudents() {
        given()
                .contentType("application/json")
                .when()
                .body(student1.toString())
                .post("student/create")
                .then()
                .statusCode(200);

        given()
                .when().get("student/getall")
                .then()
                .body("get(0)", is("<[1, Yanik Kendler, 1234, 4BHITM, null]>"))
                .statusCode(200);
    }
}
