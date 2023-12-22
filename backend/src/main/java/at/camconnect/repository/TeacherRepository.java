package at.camconnect.repository;

import at.camconnect.responseSystem.CCException;
import at.camconnect.model.Teacher;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import java.io.*;
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

    public List<Teacher> search(JsonObject searchParams){
        Query q = em.createQuery("SELECT t FROM Teacher t WHERE upper(t.lastname) LIKE :lastname || '%' ", Teacher.class)
                .setParameter("lastname", searchParams.getString("lastname").toUpperCase())
                .setMaxResults(10);
        List<Teacher> results = q.getResultList();
        return results;
    }

    public void importTeachers(File file) {
        //TODO fix the null checks when even when no file is uploaded the 1105 is never thrown only the weird arraylength check works
        if(file == null) throw new CCException(1105);

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine();

            if(line == null || line.equals("")) throw new CCException(1203);
            String[] lineArray = line.split(";");
            if (lineArray.length <= 1) throw new CCException(1203);

            //our friend \uFEFF is a invisible zero space character added to csv files when opening excel that throws off my validations :)
            lineArray[0] = lineArray[0].replaceAll("[^a-zA-Z_-]", "");

            //checks if the csv file matches the required structure
            if(lineArray.length != 5) throw new CCException(1204, "invalid line length");
            if (!lineArray[0].equals("vorname") || !lineArray[1].equals("nachname") || !lineArray[2].equals("email") || !lineArray[3].equals("username") || !lineArray[4].equals("passwort")) throw new CCException(1204, "invalid header row");

            while ((line = reader.readLine()) != null) {
                lineArray = line.split(";");
                if(lineArray.length != 5) break;
                create(new Teacher(lineArray[0], lineArray[1], lineArray[2], lineArray[3], lineArray[4]));
            }
        } catch (IOException e) {
            throw new CCException(1204, "File could not be read: " + e.getMessage());
        }
    }
}
