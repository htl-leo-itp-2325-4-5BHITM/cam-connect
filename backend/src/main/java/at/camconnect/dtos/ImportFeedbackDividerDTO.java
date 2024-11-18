package at.camconnect.dtos;

import java.util.List;

public record ImportFeedbackDividerDTO(List<ImportFeedbackDTO> correct, List<ImportFeedbackDTO> incorrect) {
}
