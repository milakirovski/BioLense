package mk.ukim.finki.uikt.biolense.backendbiolense.service.application.impl;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import mk.ukim.finki.uikt.biolense.backendbiolense.models.Diagnosis;
import mk.ukim.finki.uikt.biolense.backendbiolense.repositories.DiagnosisRepository;
import mk.ukim.finki.uikt.biolense.backendbiolense.service.application.ExportService;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExportServiceImpl implements ExportService {

    private final DiagnosisRepository diagnosisRepository;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final String[] HEADERS = {"Plant", "Disease", "Confidence", "Field", "Date", "Treatment"};

    public ExportServiceImpl(DiagnosisRepository diagnosisRepository) {
        this.diagnosisRepository = diagnosisRepository;
    }

    @Override
    public byte[] generatePdf(Long userId) {
        List<Diagnosis> diagnoses = diagnosisRepository.findByCropUserId(userId);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfDocument pdfDoc = new PdfDocument(new PdfWriter(out));
        Document document = new Document(pdfDoc);

        Paragraph title = new Paragraph("BioLens — Diagnosis History")
                .setFontSize(18)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(title);

        Table table = new Table(HEADERS.length);
        for (String header : HEADERS) {
            table.addHeaderCell(new Cell().add(new Paragraph(header).setBold()));
        }

        for (Diagnosis d : diagnoses) {
            table.addCell(new Cell().add(new Paragraph(d.getPlantName())));
            table.addCell(new Cell().add(new Paragraph(orNA(d.getDiseaseName()))));
            table.addCell(new Cell().add(new Paragraph(formatConfidence(d.getConfidence()))));
            table.addCell(new Cell().add(new Paragraph(d.getCrop().getFieldName())));
            table.addCell(new Cell().add(new Paragraph(d.getDiagnosedAt().format(DATE_FMT))));
            table.addCell(new Cell().add(new Paragraph(orNA(d.getTreatment()))));
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }

    @Override
    public byte[] generateExcel(Long userId) {
        List<Diagnosis> diagnoses = diagnosisRepository.findByCropUserId(userId);

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Diagnosis History");

            Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(boldFont);

            Row header = sheet.createRow(0);
            for (int i = 0; i < HEADERS.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = header.createCell(i);
                cell.setCellValue(HEADERS[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Diagnosis d : diagnoses) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(d.getPlantName());
                row.createCell(1).setCellValue(orNA(d.getDiseaseName()));
                row.createCell(2).setCellValue(formatConfidence(d.getConfidence()));
                row.createCell(3).setCellValue(d.getCrop().getFieldName());
                row.createCell(4).setCellValue(d.getDiagnosedAt().format(DATE_FMT));
                row.createCell(5).setCellValue(orNA(d.getTreatment()));
            }

            for (int i = 0; i < HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String orNA(String value) {
        return value != null ? value : "N/A";
    }

    private String formatConfidence(Double confidence) {
        return confidence != null ? String.format("%.1f%%", confidence * 100) : "N/A";
    }
}
