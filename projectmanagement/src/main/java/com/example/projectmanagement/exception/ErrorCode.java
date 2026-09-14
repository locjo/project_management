package com.example.projectmanagement.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    VALIDATION_ERROR(1000, "Dữ liệu đầu vào không hợp lệ"),
    BAD_REQUEST(4000, "Yêu cầu không hợp lệ"),
    UNAUTHORIZED(4010, "Bạn chưa được xác thực"),
    FORBIDDEN(4030, "Bạn không có quyền thực hiện thao tác này"),
    NOT_FOUND(4040, "Không tìm thấy dữ liệu"),
    INTERNAL_SERVER_ERROR(5000, "Lỗi hệ thống, vui lòng thử lại sau");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public static ErrorCode fromHttpStatus(HttpStatus status) {
        if (status == null) {
            return INTERNAL_SERVER_ERROR;
        }

        return switch (status) {
            case BAD_REQUEST -> BAD_REQUEST;
            case UNAUTHORIZED -> UNAUTHORIZED;
            case FORBIDDEN -> FORBIDDEN;
            case NOT_FOUND -> NOT_FOUND;
            default -> INTERNAL_SERVER_ERROR;
        };
    }
}
