package at.camconnect.repository;

import at.camconnect.dtos.AutocompleteOptionDTO;
import at.camconnect.dtos.StudentDTO;
import at.camconnect.responseSystem.CCException;
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

    public List<AutocompleteOptionDTO> search(String searchTerm){
        return em.createQuery(
                        "SELECT new at.camconnect.dtos.AutocompleteOptionDTO(s, s.user_id) FROM Student s " +
                                "WHERE UPPER(s.firstname) LIKE :searchTerm " +
                                "OR UPPER(s.lastname) LIKE :searchTerm " +
                                "OR UPPER(CONCAT(s.firstname, ' ', s.lastname)) LIKE :searchTerm",
                        AutocompleteOptionDTO.class)
                .setParameter("searchTerm", searchTerm.toUpperCase() + "%")
                .getResultList();
    }

    /**
     * Imports students from a csv file
     * Format: firstname;lastname;email;username;password;school_class
     * @param file
     */
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

            while ((line = reader.readLine()) != null) {
                lineArray = line.split(";");
                if(lineArray.length != 4) break;
                create(new Student(lineArray[0], lineArray[1], lineArray[2], lineArray[3], lineArray[4], lineArray[5]));
            }
        } catch (IOException e) {
            throw new CCException(1204, "File could not be read");
        }
    }
}
