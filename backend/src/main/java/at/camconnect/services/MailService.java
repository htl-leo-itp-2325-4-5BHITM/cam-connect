package at.camconnect.services;

import at.camconnect.model.Rent;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.quarkus.qute.Template;
import io.smallrye.common.annotation.RunOnVirtualThread;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@ApplicationScoped
@Transactional
public class MailService {
    @Inject
    Mailer mailer;

    @Inject
    Template confirmationRequest;

    @ConfigProperty(name = "FRONTEND_URL")
    String FRONTEND_URL;

    public static void sendReturnEmail(Rent rent) {
        /*I dont think we need to annoy users all the time by sending them emails because of stuff like this*/
    }

    public void sendConfirmEmail(List<Rent> rents) {
        int currentYear = LocalDate.now().getYear();

        StringBuilder verificationCodes = new StringBuilder();
        StringBuilder rentIds = new StringBuilder();

        boolean first = true;
        for (Rent rent : rents) {
            if(first){
                first = false;
            }
            else{
                verificationCodes.append(",");
                rentIds.append(",");
            }

            verificationCodes.append(rent.getVerification_code());
            rentIds.append(rent.getRent_id());
        }

        String url = FRONTEND_URL + "/confirm?ids=" + rentIds + "&codes=" + verificationCodes + "&name=" + rents.get(0).getStudent().getFirstname();

        // Render email content from template
        String emailContent = confirmationRequest
                .data("frontendUrl", url)
                .data("currentYear", currentYear)
                .data("name", rents.get(0).getStudent().getFirstname())
                .data("rents", rents)
                .render();

        // Determine recipient email
        String recipient = rents.get(0).getStudent().getEmail();

        System.out.println("Email to " + recipient + " - " + url);

        String subject = "Bestätigung deines Geräteverleihs";

        // Load logo as Base64 (optional)
        byte[] logoBytes = loadLogoAsBase64();

        // Create and send email
        Mail mail = Mail.withHtml(recipient, subject, emailContent)
                .setFrom("cam-connect@htl-leonding.ac.at")
                .addInlineAttachment("logo.png", logoBytes, "image/png", "camConnectLogo");

        CompletableFuture.runAsync(() -> {
            mailer.send(mail);
        });
    }

    private byte[] loadLogoAsBase64() {
        try (InputStream inputStream = getClass().getResourceAsStream("/img/cc-wordmark-black.png")) {
            return inputStream.readAllBytes();
        } catch (IOException e) {
            throw new IllegalArgumentException("Logo not found");
        }
    }
}
