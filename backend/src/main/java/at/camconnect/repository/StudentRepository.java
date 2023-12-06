package at.camconnect.repository;

import at.camconnect.statusSystem.CCException;
import at.camconnect.model.Student;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

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
        Student result = em.find(Student.class, id);
        if (result == null) throw new CCException(1101);
        return result;
    }

    public List<Student> getAll(){
        List<Student> students = em.createQuery("SELECT s FROM Student s", Student.class).getResultList();
        return students;
    }

    public List<Student> search(JsonObject searchParams){
        Query q = em.createQuery("SELECT s FROM Student s WHERE upper(s.firstname) LIKE :firstname || '%' ", Student.class)
                .setParameter("firstname", searchParams.getString("firstname").toUpperCase())
                .setMaxResults(10);
        return (List<Student>) q.getResultList();
    }

    public void importStudents(File file) {
        //TODO fix the null checks when even when no file is uploaded the 1105 is never thrown only the weird arraylength check works
        if(file == null) throw new CCException(1105);

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine();

            if(line == null || line.equals("")) throw new CCException(1203);
            String[] lineArray = line.split(";");
            if (lineArray.length <= 1) throw new CCException(1203);

            //removes characters like our friend \uFEFF a invisible zero space character added to csv files when opening excel that throws off my validations :)
            lineArray[0] = lineArray[0].replaceAll("[^a-zA-Z_-]", "");

            //checks if the csv file matches the required structure
            if(lineArray.length != 6) throw new CCException(1204, "invalid line length");
            if (!lineArray[0].equals("vorname") || !lineArray[1].equals("nachname") || !lineArray[2].equals("klasse") || !lineArray[3].equals("email") || !lineArray[4].equals("username") || !lineArray[5].equals("passwort")){
                System.out.println("invalid header row: " + lineArray[0] + ", " + lineArray[1] + ", " + lineArray[2] + ", " + lineArray[3] + ", " + lineArray[4]);
                throw new CCException(1204, "invalid header row: " + lineArray[0] + ", " + lineArray[1] + ", " + lineArray[2] + ", " + lineArray[3] + ", " + lineArray[4]);
            }

            while ((line = reader.readLine()) != null) {
                lineArray = line.split(";");
                if(lineArray.length != 6) break;
                create(new Student(lineArray[0], lineArray[1], lineArray[2], lineArray[3], lineArray[4], lineArray[5]));
            }
        } catch (IOException e) {
            throw new CCException(1204, "File could not be read");
        }
    }
}
