package user

import (
	"encoding/json"
	"net/http"

	"github.com/digipandit/backend/internal/auth"
	"github.com/digipandit/backend/pkg/response"
	"github.com/go-playground/validator/v10"
)

// Handler handles HTTP requests for user operations
type Handler struct {
	service  *Service
	validate *validator.Validate
}

// NewHandler creates a new user handler
func NewHandler(service *Service) *Handler {
	return &Handler{
		service:  service,
		validate: validator.New(),
	}
}

// GetMe returns the current authenticated user's profile
func (h *Handler) GetMe(w http.ResponseWriter, r *http.Request) {
	userID := auth.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.Unauthorized(w, "User not authenticated")
		return
	}

	user, err := h.service.GetByID(r.Context(), userID)
	if err != nil {
		response.InternalServerError(w, "Failed to fetch user profile")
		return
	}

	if user == nil {
		response.NotFound(w, "User profile not found")
		return
	}

	response.OK(w, UserResponse{User: user})
}

// UpdateMe updates the current authenticated user's profile
func (h *Handler) UpdateMe(w http.ResponseWriter, r *http.Request) {
	userID := auth.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.Unauthorized(w, "User not authenticated")
		return
	}

	var req UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	if err := h.validate.Struct(req); err != nil {
		response.ValidationError(w, err.Error())
		return
	}

	user, err := h.service.UpdateProfile(r.Context(), userID, &req)
	if err != nil {
		response.InternalServerError(w, "Failed to update profile")
		return
	}

	if user == nil {
		response.NotFound(w, "User profile not found")
		return
	}

	response.OK(w, UserResponse{User: user})
}

// DeleteMe deletes the current authenticated user's account
func (h *Handler) DeleteMe(w http.ResponseWriter, r *http.Request) {
	userID := auth.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.Unauthorized(w, "User not authenticated")
		return
	}

	if err := h.service.Delete(r.Context(), userID); err != nil {
		response.InternalServerError(w, "Failed to delete account")
		return
	}

	response.NoContent(w)
}
