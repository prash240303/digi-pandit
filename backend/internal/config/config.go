package config

import (
	"log"
	"os"
	"strings"
	"sync"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
	// Server
	Port string
	Env  string

	// Supabase
	SupabaseURL        string
	SupabaseAnonKey    string
	SupabaseServiceKey string

	// JWT
	JWTSecret string

	// CORS
	AllowedOrigins []string
}

var (
	config *Config
	once   sync.Once
)

// Load initializes and returns the application configuration
func Load() *Config {
	once.Do(func() {
		// Load .env file if it exists (ignore error for production)
		_ = godotenv.Load()

		config = &Config{
			Port:               getEnv("PORT", "8080"),
			Env:                getEnv("ENV", "development"),
			SupabaseURL:        getEnvRequired("SUPABASE_URL"),
			SupabaseAnonKey:    getEnvRequired("SUPABASE_ANON_KEY"),
			SupabaseServiceKey: getEnvRequired("SUPABASE_SERVICE_KEY"),
			JWTSecret:          getEnvRequired("JWT_SECRET"),
			AllowedOrigins:     parseOrigins(getEnv("ALLOWED_ORIGINS", "*")),
		}

		log.Printf("Configuration loaded successfully (env: %s)", config.Env)
	})

	return config
}

// Get returns the current configuration (must call Load first)
func Get() *Config {
	if config == nil {
		return Load()
	}
	return config
}

// IsDevelopment returns true if running in development mode
func (c *Config) IsDevelopment() bool {
	return c.Env == "development"
}

// IsProduction returns true if running in production mode
func (c *Config) IsProduction() bool {
	return c.Env == "production"
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvRequired(key string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Fatalf("Required environment variable %s is not set", key)
	}
	return value
}

func parseOrigins(origins string) []string {
	if origins == "*" {
		return []string{"*"}
	}
	return strings.Split(origins, ",")
}
