package com.example.projectmanagement.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateGraduationTermRequest(
        @NotBlank(message = "Mã đợt đồ án không được để trống") String code,
        @NotBlank(message = "Tên đợt đồ án không được để trống") String name,
        @NotBlank(message = "Năm học không được để trống") String academicYear,
        @NotBlank(message = "Học kỳ không được để trống") String semester,
        @NotNull(message = "Ngày bắt đầu không được để trống") LocalDateTime startDate,
        @NotNull(message = "Ngày kết thúc không được để trống") LocalDateTime endDate,
        @NotNull(message = "Hạn đăng ký không được để trống") LocalDateTime registrationDeadline,
        @NotNull(message = "Trạng thái hoạt động không được để trống") Boolean isActive
) {
}
