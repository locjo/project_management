package com.example.projectmanagement.service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.text.Normalizer;

import org.springframework.http.HttpStatus;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.EncryptedDocumentException;

import com.example.projectmanagement.dto.request.CreateStudentRequest;
import com.example.projectmanagement.dto.response.StudentResponse;
import com.example.projectmanagement.dto.response.StudentImportResult;
import com.example.projectmanagement.dto.response.StudentImportResult.StudentImportRowResult;
import com.example.projectmanagement.entity.Student;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.entity.UserRole;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.StudentRepository;
import com.example.projectmanagement.repository.UserRepository;

@Service
public class StudentService {
    private final StudentRepository students;
    private final UserRepository users;
    private final TransactionTemplate transactions;

    public StudentService(StudentRepository students, UserRepository users, PlatformTransactionManager transactionManager) {
        this.students = students;
        this.users = users;
        this.transactions = new TransactionTemplate(transactionManager);
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getAll() {
        return students.findAllByOrderByIdDesc().stream().map(StudentService::toResponse).toList();
    }

    @Transactional
    public StudentResponse create(CreateStudentRequest request) {
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        String studentCode = request.studentCode().trim();

        if (users.existsByUsernameIgnoreCase(username)) {
            throw new AppException("Tên đăng nhập đã được sử dụng", HttpStatus.CONFLICT);
        }
        if (users.existsByEmailIgnoreCase(email)) {
            throw new AppException("Email đã được sử dụng", HttpStatus.CONFLICT);
        }
        if (students.existsByStudentCodeIgnoreCase(studentCode)) {
            throw new AppException("Mã sinh viên đã tồn tại", HttpStatus.CONFLICT);
        }

        User user = users.save(User.builder()
                .username(username)
                .email(email)
                .role(UserRole.STUDENT)
                .isActive(true)
                .build());
        Student student = students.save(Student.builder()
                .user(user)
                .studentCode(studentCode)
                .lastName(request.lastName().trim())
                .firstName(request.firstName().trim())
                .dateOfBirth(request.dateOfBirth())
                .classCode(trimToNull(request.classCode()))
                .academicYear(request.academicYear().trim())
                .build());
        return toResponse(student);
    }

    public StudentImportResult importExcel(MultipartFile file, String emailDomain, String academicYear) {
        if (file == null || file.isEmpty()) {
            throw new AppException("Vui lòng chọn file Excel có dữ liệu", HttpStatus.BAD_REQUEST);
        }
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase(Locale.ROOT).endsWith(".xlsx")) {
            throw new AppException("Chỉ chấp nhận file Excel .xlsx", HttpStatus.BAD_REQUEST);
        }

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            if (workbook.getNumberOfSheets() == 0) {
                throw new AppException("File Excel không có trang tính", HttpStatus.BAD_REQUEST);
            }
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet.getLastRowNum() > 10000) {
                throw new AppException("File Excel có vùng dữ liệu quá lớn", HttpStatus.BAD_REQUEST);
            }
            DataFormatter formatter = new DataFormatter(Locale.ROOT);
            HeaderInfo headerInfo = findHeader(sheet, formatter);
            Map<String, Integer> columns = headerInfo.columns();
            String normalizedEmailDomain = normalizeEmailDomain(emailDomain);
            String fallbackAcademicYear = trimToNull(academicYear);
            if (!columns.containsKey("email") && normalizedEmailDomain == null) {
                throw new AppException("File này không có cột email. Hãy nhập tên miền email sinh viên để tạo email từ mã sinh viên", HttpStatus.BAD_REQUEST);
            }
            if (!columns.containsKey("academicYear") && fallbackAcademicYear == null) {
                throw new AppException("File này không có cột năm học. Hãy nhập năm học áp dụng cho danh sách", HttpStatus.BAD_REQUEST);
            }

            List<StudentImportRowResult> results = new ArrayList<>();
            int imported = 0;
            int totalRows = 0;
            for (int index = headerInfo.rowNumber() + 1; index <= sheet.getLastRowNum(); index++) {
                Row row = sheet.getRow(index);
                if (isBlankRow(row, columns, formatter)) continue;
                if (++totalRows > 1000) {
                    throw new AppException("Mỗi file chỉ được nhập tối đa 1000 sinh viên", HttpStatus.BAD_REQUEST);
                }
                int rowNumber = index + 1;
                String studentCode = cellValue(row, columns, "studentCode", formatter);
                try {
                    CreateStudentRequest request = requestFromRow(row, columns, formatter, normalizedEmailDomain, fallbackAcademicYear);
                    StudentResponse created = transactions.execute(status -> create(request));
                    imported++;
                    results.add(new StudentImportRowResult(rowNumber, created.studentCode(), true, "Đã thêm"));
                } catch (AppException ex) {
                    results.add(new StudentImportRowResult(rowNumber, studentCode, false, ex.getMessage()));
                } catch (DataIntegrityViolationException ex) {
                    results.add(new StudentImportRowResult(rowNumber, studentCode, false,
                            describeConstraintFailure(ex)));
                }
            }
            return new StudentImportResult(results.size(), imported, results.size() - imported, results);
        } catch (AppException ex) {
            throw ex;
        } catch (IOException | EncryptedDocumentException | IllegalArgumentException ex) {
            throw new AppException("Không đọc được file Excel. Hãy dùng file .xlsx theo mẫu của hệ thống", HttpStatus.BAD_REQUEST);
        }
    }

    public byte[] createExcelTemplate() {
        try (Workbook workbook = new XSSFWorkbook(); var output = new java.io.ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Sinh viên");
            var headerStyle = workbook.createCellStyle();
            var headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
        String[] headers = {"Mã sinh viên", "Tên đăng nhập", "Email", "Họ", "Tên", "Ngày sinh", "Lớp", "Số điện thoại", "Năm học"};
            Row header = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 22 * 256);
            }
            sheet.createFreezePane(0, 1);
            workbook.write(output);
            return output.toByteArray();
        } catch (IOException ex) {
            throw new IllegalStateException("Không thể tạo file mẫu Excel", ex);
        }
    }

    private CreateStudentRequest requestFromRow(Row row, Map<String, Integer> columns, DataFormatter formatter,
            String emailDomain, String academicYearFallback) {
        String studentCode = requiredCell(row, columns, "studentCode", formatter, "Mã sinh viên");
        String username = cellValue(row, columns, "username", formatter);
        if (username.isBlank()) username = studentCode;
        String email = cellValue(row, columns, "email", formatter);
        if (email.isBlank() && emailDomain != null) email = studentCode + "@" + emailDomain;
        if (email.isBlank()) throw new AppException("Thiếu Email", HttpStatus.BAD_REQUEST);
        String dateText = cellValue(row, columns, "dateOfBirth", formatter);
        LocalDate dateOfBirth = parseDate(row, columns.get("dateOfBirth"), dateText, formatter);
        if (email.length() > 100 || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new AppException("Email không hợp lệ", HttpStatus.BAD_REQUEST);
        }
        String year = cellValue(row, columns, "academicYear", formatter);
        if (year.isBlank()) year = academicYearFallback;
        if (year == null || year.isBlank()) throw new AppException("Thiếu Năm học", HttpStatus.BAD_REQUEST);
        return new CreateStudentRequest(
                username, email, studentCode,
                requiredCell(row, columns, "lastName", formatter, "Họ"),
                requiredCell(row, columns, "firstName", formatter, "Tên"), dateOfBirth,
                cellValue(row, columns, "classCode", formatter),
                year);
    }

    private HeaderInfo findHeader(Sheet sheet, DataFormatter formatter) {
        for (int rowIndex = 0; rowIndex < Math.min(sheet.getLastRowNum() + 1, 20); rowIndex++) {
            Row row = sheet.getRow(rowIndex);
            if (row == null) continue;
            Map<String, Integer> columns = new HashMap<>();
            for (Cell cell : row) {
                String field = fieldForHeader(formatter.formatCellValue(cell));
                if (field != null && columns.putIfAbsent(field, cell.getColumnIndex()) != null) {
                    throw new AppException("Tiêu đề cột bị lặp: " + field, HttpStatus.BAD_REQUEST);
                }
            }
            if (columns.containsKey("studentCode") && columns.containsKey("lastName") && columns.containsKey("firstName")) {
                return new HeaderInfo(rowIndex, columns);
            }
        }
        throw new AppException("Không tìm thấy dòng tiêu đề có các cột mã sinh viên, họ lót và tên", HttpStatus.BAD_REQUEST);
    }

    private String normalizeEmailDomain(String value) {
        String domain = trimToNull(value);
        if (domain == null) return null;
        while (domain.startsWith("@")) domain = domain.substring(1);
        return domain.isBlank() ? null : domain.toLowerCase(Locale.ROOT);
    }

    private String describeConstraintFailure(DataIntegrityViolationException exception) {
        Throwable cause = org.springframework.core.NestedExceptionUtils.getMostSpecificCause(exception);
        String detail = cause.getMessage() == null ? "" : cause.getMessage().toLowerCase(Locale.ROOT);
        if (detail.contains("phone") && (detail.contains("not-null") || detail.contains("null value"))) {
            return "Database vẫn bắt buộc số điện thoại. Hãy chạy backend/sql/20261103_allow_student_phone_missing.sql rồi khởi động lại backend";
        }
        if (detail.contains("student_code")) return "Mã sinh viên đã tồn tại trong database";
        if (detail.contains("username")) return "Tên đăng nhập đã tồn tại trong database";
        if (detail.contains("email")) return "Email đã tồn tại trong database";
        if (detail.contains("phone")) return "Số điện thoại đã tồn tại hoặc không hợp lệ";
        return "Dữ liệu vi phạm ràng buộc database; kiểm tra mã SV, email, username và số điện thoại";
    }

    private record HeaderInfo(int rowNumber, Map<String, Integer> columns) {}

    private String requiredCell(Row row, Map<String, Integer> columns, String field, DataFormatter formatter, String label) {
        String value = cellValue(row, columns, field, formatter);
        if (value.isBlank()) throw new AppException("Thiếu " + label, HttpStatus.BAD_REQUEST);
        return value;
    }

    private String cellValue(Row row, Map<String, Integer> columns, String field, DataFormatter formatter) {
        Integer column = columns.get(field);
        if (column == null || row == null) return "";
        Cell cell = row.getCell(column);
        if (cell == null) return "";
        return formatter.formatCellValue(cell).trim();
    }

    private LocalDate parseDate(Row row, Integer column, String value, DataFormatter formatter) {
        if (column == null || value.isBlank()) return null;
        Cell cell = row.getCell(column);
        if (cell != null && cell.getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return DateUtil.getLocalDateTime(cell.getNumericCellValue()).toLocalDate();
        }
        for (DateTimeFormatter pattern : List.of(DateTimeFormatter.ISO_LOCAL_DATE,
                DateTimeFormatter.ofPattern("d/M/uuuu"), DateTimeFormatter.ofPattern("d-M-uuuu"))) {
            try { return LocalDate.parse(value, pattern); }
            catch (DateTimeParseException ignored) { }
        }
        throw new AppException("Ngày sinh không hợp lệ; dùng định dạng yyyy-MM-dd", HttpStatus.BAD_REQUEST);
    }

    private boolean isBlankRow(Row row, Map<String, Integer> columns, DataFormatter formatter) {
        return columns.keySet().stream().allMatch(field -> cellValue(row, columns, field, formatter).isBlank());
    }

    private String fieldForHeader(String header) {
        String normalized = Normalizer.normalize(header, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
        return switch (normalized) {
            case "studentcode", "masinhvien", "mssv", "masv" -> "studentCode";
            case "username", "tendangnhap" -> "username";
            case "email", "emailstudent" -> "email";
            case "lastname", "ho", "holotsv" -> "lastName";
            case "firstname", "ten", "tensv" -> "firstName";
            case "dateofbirth", "ngaysinh", "ngaysinhc" -> "dateOfBirth";
            case "classcode", "class", "lop", "malop" -> "classCode";
            case "phone", "phonenumber", "sodienthoai", "dienthoai" -> "phone";
            case "academicyear", "namhoc" -> "academicYear";
            default -> null;
        };
    }

    private static StudentResponse toResponse(Student student) {
        User user = student.getUser();
        return new StudentResponse(student.getId(), user.getId(), user.getUsername(), user.getEmail(),
                student.getStudentCode(), student.getFullName(), student.getDateOfBirth(),
                student.getClassCode(), student.getAcademicYear());
    }

    private static String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
