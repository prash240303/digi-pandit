package response

import (
	"encoding/json"
	"net/http"
)

// Response represents a standard API response
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorInfo  `json:"error,omitempty"`
	Meta    *MetaInfo   `json:"meta,omitempty"`
}

// ErrorInfo contains error details
type ErrorInfo struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// MetaInfo contains pagination or additional metadata
type MetaInfo struct {
	Page       int `json:"page,omitempty"`
	PerPage    int `json:"per_page,omitempty"`
	Total      int `json:"total,omitempty"`
	TotalPages int `json:"total_pages,omitempty"`
}

// JSON writes a JSON response with the given status code
func JSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// Success sends a successful response
func Success(w http.ResponseWriter, status int, data interface{}) {
	JSON(w, status, Response{
		Success: true,
		Data:    data,
	})
}

// OK sends a 200 OK response with data
func OK(w http.ResponseWriter, data interface{}) {
	Success(w, http.StatusOK, data)
}

// Created sends a 201 Created response with data
func Created(w http.ResponseWriter, data interface{}) {
	Success(w, http.StatusCreated, data)
}

// NoContent sends a 204 No Content response
func NoContent(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNoContent)
}

// Error sends an error response
func Error(w http.ResponseWriter, status int, code, message string) {
	JSON(w, status, Response{
		Success: false,
		Error: &ErrorInfo{
			Code:    code,
			Message: message,
		},
	})
}

// BadRequest sends a 400 Bad Request error
func BadRequest(w http.ResponseWriter, message string) {
	Error(w, http.StatusBadRequest, "BAD_REQUEST", message)
}

// Unauthorized sends a 401 Unauthorized error
func Unauthorized(w http.ResponseWriter, message string) {
	Error(w, http.StatusUnauthorized, "UNAUTHORIZED", message)
}

// Forbidden sends a 403 Forbidden error
func Forbidden(w http.ResponseWriter, message string) {
	Error(w, http.StatusForbidden, "FORBIDDEN", message)
}

// NotFound sends a 404 Not Found error
func NotFound(w http.ResponseWriter, message string) {
	Error(w, http.StatusNotFound, "NOT_FOUND", message)
}

// InternalServerError sends a 500 Internal Server Error
func InternalServerError(w http.ResponseWriter, message string) {
	Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", message)
}

// ValidationError sends a 422 Unprocessable Entity error for validation failures
func ValidationError(w http.ResponseWriter, message string) {
	Error(w, http.StatusUnprocessableEntity, "VALIDATION_ERROR", message)
}

// WithMeta adds pagination metadata to a successful response
func WithMeta(w http.ResponseWriter, data interface{}, meta MetaInfo) {
	JSON(w, http.StatusOK, Response{
		Success: true,
		Data:    data,
		Meta:    &meta,
	})
}
