package api

import (
	"net/http"
	"time"

	"github.com/digipandit/backend/internal/auth"
	"github.com/digipandit/backend/internal/config"
	"github.com/digipandit/backend/internal/user"
	"github.com/digipandit/backend/pkg/response"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

// NewRouter creates and configures the main router
func NewRouter(cfg *config.Config, authService *auth.Service, userService *user.Service) *chi.Mux {
	r := chi.NewRouter()

	// Global middleware
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(30 * time.Second))

	// CORS configuration
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   cfg.AllowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Create handlers
	authHandler := auth.NewHandler(authService)
	userHandler := user.NewHandler(userService)

	// API v1 routes
	r.Route("/api/v1", func(r chi.Router) {
		// Health check (public)
		r.Get("/health", healthCheck)

		// Auth routes (public)
		r.Route("/auth", func(r chi.Router) {
			r.Post("/signup", authHandler.SignUp)
			r.Post("/signin", authHandler.SignIn)
			r.Post("/refresh", authHandler.RefreshToken)
			r.Get("/oauth", authHandler.GetOAuthURL)
			r.Post("/oauth/verify", authHandler.VerifyOAuthToken)

			// Protected auth routes
			r.Group(func(r chi.Router) {
				r.Use(auth.JWTMiddleware(cfg))
				r.Post("/signout", authHandler.SignOut)
				r.Get("/me", authHandler.GetMe)
			})
		})

		// User routes (protected)
		r.Route("/users", func(r chi.Router) {
			r.Use(auth.JWTMiddleware(cfg))
			r.Get("/me", userHandler.GetMe)
			r.Put("/me", userHandler.UpdateMe)
			r.Delete("/me", userHandler.DeleteMe)
		})
	})

	return r
}

// healthCheck returns the API health status
func healthCheck(w http.ResponseWriter, r *http.Request) {
	response.OK(w, map[string]interface{}{
		"status":    "ok",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"version":   "1.0.0",
	})
}
