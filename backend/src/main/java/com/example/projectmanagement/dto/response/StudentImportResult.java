package com.example.projectmanagement.dto.response;

import java.util.List;

public record StudentImportResult(
        int totalRows,
        int importedCount,
        int failedCount,
        List<StudentImportRowResult> rows
) {
    public record StudentImportRowResult(int rowNumber, String studentCode, boolean imported, String message) {}
}
