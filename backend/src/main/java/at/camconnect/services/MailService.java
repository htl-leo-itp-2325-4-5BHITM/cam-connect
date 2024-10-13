package at.camconnect.services;

import at.camconnect.model.Rent;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.quarkus.qute.Template;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;

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
                .render();

        // Determine recipient email
        String recipient = rents.get(0).getStudent().getEmail();

        System.out.println(recipient);

        String subject = "Bestätigung deines Geräteverleihs";

        // Load logo as Base64 (optional)
        byte[] logoBytes = loadLogoAsBase64();

        // Create and send email
        Mail mail = Mail.withHtml(recipient, subject, emailContent)
                .setFrom("signup.camconnect@gmail.com")
                .addInlineAttachment("logo.png", logoBytes, "image/png", "camConnectLogo");

        mailer.send(mail);
    }

    private byte[] loadLogoAsBase64() {
        try (InputStream inputStream = getClass().getResourceAsStream("/img/cc-wordmark-black.png")) {
            return inputStream.readAllBytes();
        } catch (IOException e) {
            throw new IllegalArgumentException("Logo not found");
        }
    }
}
