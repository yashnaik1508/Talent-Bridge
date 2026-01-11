package com.talentbridge.exception;

public class CustomException extends RuntimeException {
    private String errorCode;
    
    public CustomException(String message) {
        super(message);
    }
    
    public CustomException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}
