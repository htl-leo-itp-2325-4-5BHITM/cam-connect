package at.camconnect.repository;

import at.camconnect.errorSystem.CCException;
import at.camconnect.model.Student;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.*;
import java.util.*;

@ApplicationScoped
public class StudentRepository{
    @Inject
    EntityManager em;

    @Transactional
    public void create(Student s){
        em.persist(s);
    }

    @Transactional
    public void remove(Student s){
        em.remove(s);
    }

    @Transactional
    public void update(Student s){
        em.merge(s);
    }

    public Student getById(long id){
        return em.find(Student.class, id);
    }


    /*public Student getById(long id){
        Query q = em.createNativeQuery("SELECT * FROM Student where student_id = " + id);
        Student result = (Student) q.getSingleResult();
        return result;
    }*/

    public List<Student> getAll(){
        List<Student> students = em.createQuery("SELECT s FROM Student s", Student.class).getResultList();
        return students;
    }

    public List<Student> search(JsonObject searchParams){
        Query q = em.createQuery("SELECT s FROM Student s WHERE upper(s.firstname) LIKE :firstname || '%' ", Student.class)
                .setParameter("firstname", searchParams.getString("firstname").toUpperCase())
                .setMaxResults(10);
        List<Student> results = q.getResultList();
        return results;
    }

    public void importStudents(File file) {
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine();
            if(line == null) throw new CCException(1203);
            String[] lineArray = line.split(";");

            if (!lineArray[0].equals("vorname") || !lineArray[1].equals("nachname") || !lineArray[2].equals("klasse") || !lineArray[3].equals("email") || !lineArray[4].equals("username") || !lineArray[5].equals("passwort")) throw new CCException(1204);
            if(lineArray.length != 6) throw new CCException(1204);

            while ((line = reader.readLine()) != null) {
                create(new Student(lineArray[0], lineArray[1], lineArray[2], lineArray[3], lineArray[4], lineArray[5]));
            }
        } catch (IOException e) {
            //TODO right error code
            throw new CCException(1200);
        }
    }
}
