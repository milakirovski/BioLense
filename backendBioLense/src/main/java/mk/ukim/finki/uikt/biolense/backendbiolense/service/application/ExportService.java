package mk.ukim.finki.uikt.biolense.backendbiolense.service.application;

public interface ExportService {

    byte[] generatePdf(Long userId);

    byte[] generateExcel(Long userId);
}
