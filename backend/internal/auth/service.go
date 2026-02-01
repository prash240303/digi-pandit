package auth

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/digipandit/backend/internal/config"
)

// Service handles authentication business logic using Supabase REST API
type Service struct {
	cfg        *config.Config
	httpClient *http.Client
}

// NewService creates a new auth service
func NewService(cfg *config.Config) *Service {
	return &Service{
		cfg:        cfg,
		httpClient: &http.Client{},
	}
}

// SignUpRequest represents a signup request
type SignUpRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

// SignInRequest represents a signin request
type SignInRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// OAuthRequest represents an OAuth token exchange request
type OAuthRequest struct {
	AccessToken  string `json:"access_token" validate:"required"`
	RefreshToken string `json:"refresh_token,omitempty"`
	Provider     string `json:"provider" validate:"required,oneof=google apple"`
}

// RefreshRequest represents a token refresh request
type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// AuthResponse represents the authentication response
type AuthResponse struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	TokenType    string    `json:"token_type"`
	ExpiresIn    int       `json:"expires_in"`
	User         *UserInfo `json:"user"`
}

// UserInfo represents basic user information
type UserInfo struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Phone     string `json:"phone,omitempty"`
	Provider  string `json:"provider,omitempty"`
	CreatedAt string `json:"created_at"`
}

// SupabaseAuthResponse represents the response from Supabase Auth API
type SupabaseAuthResponse struct {
	AccessToken  string       `json:"access_token"`
	RefreshToken string       `json:"refresh_token"`
	TokenType    string       `json:"token_type"`
	ExpiresIn    int          `json:"expires_in"`
	User         SupabaseUser `json:"user"`
}

// SupabaseUser represents user data from Supabase
type SupabaseUser struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	CreatedAt string `json:"created_at"`
}

// SupabaseError represents an error from Supabase
type SupabaseError struct {
	Error            string `json:"error"`
	ErrorDescription string `json:"error_description"`
	Message          string `json:"msg"`
}

// SignUp registers a new user with email and password
func (s *Service) SignUp(ctx context.Context, req *SignUpRequest) (*AuthResponse, error) {
	url := s.cfg.SupabaseURL + "/auth/v1/signup"

	body, _ := json.Marshal(map[string]string{
		"email":    req.Email,
		"password": req.Password,
	})

	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("apikey", s.cfg.SupabaseAnonKey)

	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		log.Printf("Signup HTTP error: %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode >= 400 {
		var supaErr SupabaseError
		json.Unmarshal(respBody, &supaErr)
		errMsg := supaErr.Message
		if errMsg == "" {
			errMsg = supaErr.ErrorDescription
		}
		if errMsg == "" {
			errMsg = supaErr.Error
		}
		return nil, fmt.Errorf("%s", errMsg)
	}

	var authResp SupabaseAuthResponse
	if err := json.Unmarshal(respBody, &authResp); err != nil {
		log.Printf("Signup unmarshal error: %v", err)
		return nil, err
	}

	return &AuthResponse{
		AccessToken:  authResp.AccessToken,
		RefreshToken: authResp.RefreshToken,
		TokenType:    authResp.TokenType,
		ExpiresIn:    authResp.ExpiresIn,
		User: &UserInfo{
			ID:        authResp.User.ID,
			Email:     authResp.User.Email,
			Phone:     authResp.User.Phone,
			CreatedAt: authResp.User.CreatedAt,
		},
	}, nil
}

// SignIn authenticates a user with email and password
func (s *Service) SignIn(ctx context.Context, req *SignInRequest) (*AuthResponse, error) {
	url := s.cfg.SupabaseURL + "/auth/v1/token?grant_type=password"

	body, _ := json.Marshal(map[string]string{
		"email":    req.Email,
		"password": req.Password,
	})

	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("apikey", s.cfg.SupabaseAnonKey)

	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		log.Printf("SignIn HTTP error: %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode >= 400 {
		var supaErr SupabaseError
		json.Unmarshal(respBody, &supaErr)
		return nil, fmt.Errorf("invalid credentials")
	}

	var authResp SupabaseAuthResponse
	if err := json.Unmarshal(respBody, &authResp); err != nil {
		log.Printf("SignIn unmarshal error: %v", err)
		return nil, err
	}

	return &AuthResponse{
		AccessToken:  authResp.AccessToken,
		RefreshToken: authResp.RefreshToken,
		TokenType:    authResp.TokenType,
		ExpiresIn:    authResp.ExpiresIn,
		User: &UserInfo{
			ID:        authResp.User.ID,
			Email:     authResp.User.Email,
			Phone:     authResp.User.Phone,
			CreatedAt: authResp.User.CreatedAt,
		},
	}, nil
}

// RefreshToken refreshes an access token
func (s *Service) RefreshToken(ctx context.Context, refreshToken string) (*AuthResponse, error) {
	url := s.cfg.SupabaseURL + "/auth/v1/token?grant_type=refresh_token"

	body, _ := json.Marshal(map[string]string{
		"refresh_token": refreshToken,
	})

	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("apikey", s.cfg.SupabaseAnonKey)

	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		log.Printf("RefreshToken HTTP error: %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("failed to refresh token")
	}

	var authResp SupabaseAuthResponse
	if err := json.Unmarshal(respBody, &authResp); err != nil {
		log.Printf("RefreshToken unmarshal error: %v", err)
		return nil, err
	}

	return &AuthResponse{
		AccessToken:  authResp.AccessToken,
		RefreshToken: authResp.RefreshToken,
		TokenType:    authResp.TokenType,
		ExpiresIn:    authResp.ExpiresIn,
		User: &UserInfo{
			ID:        authResp.User.ID,
			Email:     authResp.User.Email,
			Phone:     authResp.User.Phone,
			CreatedAt: authResp.User.CreatedAt,
		},
	}, nil
}

// SignOut signs out a user
func (s *Service) SignOut(ctx context.Context, accessToken string) error {
	url := s.cfg.SupabaseURL + "/auth/v1/logout"

	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, nil)
	if err != nil {
		return err
	}

	httpReq.Header.Set("apikey", s.cfg.SupabaseAnonKey)
	httpReq.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		log.Printf("SignOut HTTP error: %v", err)
		return err
	}
	defer resp.Body.Close()

	return nil
}

// GetOAuthURL generates an OAuth URL for the given provider
func (s *Service) GetOAuthURL(provider string, redirectURL string) string {
	return s.cfg.SupabaseURL + "/auth/v1/authorize?provider=" + provider + "&redirect_to=" + redirectURL
}

// VerifyOAuthToken verifies an OAuth token and returns user info
func (s *Service) VerifyOAuthToken(ctx context.Context, accessToken string) (*UserInfo, error) {
	url := s.cfg.SupabaseURL + "/auth/v1/user"

	httpReq, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("apikey", s.cfg.SupabaseAnonKey)
	httpReq.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		log.Printf("VerifyOAuthToken HTTP error: %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("invalid token")
	}

	respBody, _ := io.ReadAll(resp.Body)

	var user SupabaseUser
	if err := json.Unmarshal(respBody, &user); err != nil {
		log.Printf("VerifyOAuthToken unmarshal error: %v", err)
		return nil, err
	}

	return &UserInfo{
		ID:        user.ID,
		Email:     user.Email,
		Phone:     user.Phone,
		CreatedAt: user.CreatedAt,
	}, nil
}
