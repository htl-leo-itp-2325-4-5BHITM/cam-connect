package at.camconnect.repository;

import at.camconnect.model.Student;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.LinkedList;
import java.util.List;

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
    public boolean importStudents(String[] csv){ //nicht getestet
        try{
            List<String[]> csvLines = new LinkedList<>();
            for (String s :
                    csv) {
                csvLines.add(s.split(","));
            }

            for (String[] sArr:
                 csvLines) {
                Student student = new Student(sArr[0].trim(), sArr[1].trim(), sArr[2].trim(),sArr[3].trim(), sArr[4].trim());
                em.persist(student);
                return true;
                //Device List soll null sein
            }
         } catch (NumberFormatException e) {
            System.err.println("Fehler beim Parsen des Integers: " + e.getMessage());
        }
        return false;
    }
}
