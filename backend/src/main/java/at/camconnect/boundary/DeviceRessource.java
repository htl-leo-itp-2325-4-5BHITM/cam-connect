package at.camconnect.boundary;

import at.camconnect.dtos.FormDataDTO;
import at.camconnect.model.Device;
import at.camconnect.model.Teacher;
import at.camconnect.repository.DeviceRepository;
import at.camconnect.repository.TeacherRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.MultipartForm;

import java.io.InputStream;
import java.util.List;

@Path("/api/device")
public class DeviceRessource {
    @Inject
    DeviceRepository deviceRepository;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createDevice(Device d){
        deviceRepository.create(d);
        return Response.ok().build();
    }

    @POST
    @Path("/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response removeTeacher(Device d){
        deviceRepository.remove(d);
        return Response.ok().build();
    }

    @POST
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateTeacher(Device d){
        deviceRepository.update(d);
        return Response.ok().build();
    }

    @GET
    @Path("/getbyid/{id: [0-9]+}")
    public Device getById(@PathParam("id")long id) {
        return deviceRepository.getById(id);
    }

    @GET
    @Path("/getall")
    public List<Device> getAll() {
        return deviceRepository.getAll();
    }

    @POST
    @Path("/importdevices")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.TEXT_PLAIN)
    public Response uploadCsvFile(@MultipartForm FormDataDTO formData) {
        // FormData enthält die Informationen zur Datei
        InputStream fileInputStream = formData.file();
        String fileName = formData.filename();

        // Hier wird die CSV-Datei an die Repository-Klasse weitergeleitet
        try {
            deviceRepository.importDevices(fileInputStream);
            return Response.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(400).build();
        }
    }
}
