package at.camconnect.repository;

import at.camconnect.model.Rent;
import at.camconnect.model.Student;
import at.camconnect.model.Teacher;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Path;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

@ApplicationScoped
public class TeacherRepository {
    @Inject
    EntityManager em;


    @Transactional
    public void create(Teacher t){
        em.persist(t);
    }

    @Transactional
    public void remove(Teacher t){
        em.remove(t);
    }

    @Transactional
    public void update(Teacher t){
        em.merge(t);
    }

    public Teacher getById(long id){
        return em.find(Teacher.class, id);
    }

    public List<Teacher> getAll(){
        List<Teacher> teachers = em.createQuery("SELECT t FROM Teacher t", Teacher.class).getResultList();
        return teachers;
    }
    public boolean importTeachers(InputStream fileInputStream) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(fileInputStream))) {
            String line;

            while ((line = reader.readLine()) != null) {
                // Splitte die CSV-Zeile
                String[] values = line.split(",");

                // Füge die Werte zur Liste hinzu

                Teacher teacher = new Teacher(values[0].trim(), values[1].trim(), values[2].trim(),values[3].trim(), values[4].trim());
                em.persist(teacher);
            }

            return true;
            // Hier hast du das CSV als List<String[]> und kannst es weiter verarbeiten
        } catch(Exception ex){
            return false;
        }
    }
}
