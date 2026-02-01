package auth

import (
	"encoding/json"
	"net/http"

	"github.com/digipandit/backend/pkg/response"
	"github.com/go-playground/validator/v10"
)

// Handler handles HTTP requests for authentication
type Handler struct {
	service  *Service
	validate *validator.Validate
}

// NewHandler creates a new auth handler
func NewHandler(service *Service) *Handler {
	return &Handler{
		service:  service,
		validate: validator.New(),
	}
}

// SignUp handles user registration
func (h *Handler) SignUp(w http.ResponseWriter, r *http.Request) {
	var req SignUpRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	if err := h.validate.Struct(req); err != nil {
		response.ValidationError(w, err.Error())
		return
	}

	authResp, err := h.service.SignUp(r.Context(), &req)
	if err != nil {
		response.BadRequest(w, "Failed to create account: "+err.Error())
		return
	}

	response.Created(w, authResp)
}

// SignIn handles user login
func (h *Handler) SignIn(w http.ResponseWriter, r *http.Request) {
	var req SignInRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	if err := h.validate.Struct(req); err != nil {
		response.ValidationError(w, err.Error())
		return
	}

	authResp, err := h.service.SignIn(r.Context(), &req)
	if err != nil {
		response.Unauthorized(w, "Invalid credentials")
		return
	}

	response.OK(w, authResp)
}

// RefreshToken handles token refresh
func (h *Handler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	var req RefreshRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	if err := h.validate.Struct(req); err != nil {
		response.ValidationError(w, err.Error())
		return
	}

	authResp, err := h.service.RefreshToken(r.Context(), req.RefreshToken)
	if err != nil {
		response.Unauthorized(w, "Failed to refresh token")
		return
	}

	response.OK(w, authResp)
}

// SignOut handles user logout
func (h *Handler) SignOut(w http.ResponseWriter, r *http.Request) {
	// Get token from Authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		response.Unauthorized(w, "Missing authorization header")
		return
	}

	// Extract token (expect "Bearer <token>")
	var token string
	if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
		token = authHeader[7:]
	} else {
		response.Unauthorized(w, "Invalid authorization header")
		return
	}

	if err := h.service.SignOut(r.Context(), token); err != nil {
		response.InternalServerError(w, "Failed to sign out")
		return
	}

	response.OK(w, map[string]string{"message": "Successfully signed out"})
}

// GetOAuthURL returns the OAuth URL for a provider
func (h *Handler) GetOAuthURL(w http.ResponseWriter, r *http.Request) {
	provider := r.URL.Query().Get("provider")
	if provider == "" {
		response.BadRequest(w, "Provider is required")
		return
	}

	redirectURL := r.URL.Query().Get("redirect_url")
	if redirectURL == "" {
		redirectURL = r.Host + "/api/v1/auth/callback"
	}

	url := h.service.GetOAuthURL(provider, redirectURL)

	response.OK(w, map[string]string{
		"url":      url,
		"provider": provider,
	})
}

// VerifyOAuthToken verifies an OAuth token and returns user info
func (h *Handler) VerifyOAuthToken(w http.ResponseWriter, r *http.Request) {
	var req OAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	if err := h.validate.Struct(req); err != nil {
		response.ValidationError(w, err.Error())
		return
	}

	userInfo, err := h.service.VerifyOAuthToken(r.Context(), req.AccessToken)
	if err != nil {
		response.Unauthorized(w, "Invalid OAuth token")
		return
	}

	response.OK(w, map[string]interface{}{
		"user":         userInfo,
		"access_token": req.AccessToken,
	})
}

// GetMe returns the current authenticated user info from token
func (h *Handler) GetMe(w http.ResponseWriter, r *http.Request) {
	userID := GetUserIDFromContext(r.Context())
	email := GetUserEmailFromContext(r.Context())

	if userID == "" {
		response.Unauthorized(w, "User not authenticated")
		return
	}

	response.OK(w, map[string]string{
		"id":    userID,
		"email": email,
	})
}
