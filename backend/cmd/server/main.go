package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/digipandit/backend/api"
	"github.com/digipandit/backend/internal/auth"
	"github.com/digipandit/backend/internal/config"
	"github.com/digipandit/backend/internal/database"
	"github.com/digipandit/backend/internal/user"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize Supabase client
	database.InitSupabase(cfg)

	// Create services
	authService := auth.NewService(cfg)
	userService := user.NewService()

	// Create router
	router := api.NewRouter(cfg, authService, userService)

	// Create server
	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Printf("🚀 Server starting on port %s (env: %s)", cfg.Port, cfg.Env)
		log.Printf("📚 API docs: http://localhost:%s/api/v1/health", cfg.Port)

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("🛑 Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("✅ Server stopped gracefully")
}
