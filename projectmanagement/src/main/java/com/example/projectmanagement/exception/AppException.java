package com.example.projectmanagement.exception;

import org.springframework.http.HttpStatus;

public class AppException extends RuntimeException {

    private final ErrorCode errorCode;
    private final HttpStatus status;

    public AppException(String message, ErrorCode errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }

    public AppException(String message, HttpStatus status) {
        this(message, ErrorCode.fromHttpStatus(status), status);
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public int getErrorCodeValue() {
        return errorCode.getCode();
    }

    public String getErrorDescription() {
        return errorCode.getMessage();
    }

    public HttpStatus getStatus() {
        return status;
    }
}
