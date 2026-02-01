package user

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/url"

	"github.com/digipandit/backend/internal/database"
)

// Service handles user-related business logic
type Service struct{}

// NewService creates a new user service
func NewService() *Service {
	return &Service{}
}

// GetByID retrieves a user by their ID
func (s *Service) GetByID(ctx context.Context, userID string) (*User, error) {
	client := database.GetClient()

	query := fmt.Sprintf("id=eq.%s&select=*", url.QueryEscape(userID))
	data, err := client.QuerySingle("profiles", query)
	if err != nil {
		log.Printf("Error fetching user profile: %v", err)
		return nil, err
	}

	var user User
	if err := json.Unmarshal(data, &user); err != nil {
		log.Printf("Error unmarshaling user: %v", err)
		return nil, err
	}

	return &user, nil
}

// UpdateProfile updates a user's profile
func (s *Service) UpdateProfile(ctx context.Context, userID string, profile *UpdateProfileRequest) (*User, error) {
	client := database.GetClient()

	updateData := map[string]interface{}{
		"full_name":       profile.FullName,
		"date_of_birth":   profile.DateOfBirth,
		"zodiac_sign":     profile.ZodiacSign,
		"region":          profile.Region,
		"language":        profile.Language,
		"notify_festival": profile.NotifyFestival,
		"notify_daily":    profile.NotifyDaily,
	}

	query := fmt.Sprintf("id=eq.%s", url.QueryEscape(userID))
	data, err := client.Update("profiles", query, updateData)
	if err != nil {
		log.Printf("Error updating user profile: %v", err)
		return nil, err
	}

	var users []User
	if err := json.Unmarshal(data, &users); err != nil {
		log.Printf("Error unmarshaling updated user: %v", err)
		return nil, err
	}

	if len(users) == 0 {
		return nil, nil
	}

	return &users[0], nil
}

// CreateProfile creates a new user profile
func (s *Service) CreateProfile(ctx context.Context, userID, email string, profile *CreateProfileRequest) (*User, error) {
	client := database.GetClient()

	createData := map[string]interface{}{
		"id":              userID,
		"email":           email,
		"full_name":       profile.FullName,
		"date_of_birth":   profile.DateOfBirth,
		"zodiac_sign":     profile.ZodiacSign,
		"region":          profile.Region,
		"language":        profile.Language,
		"notify_festival": profile.NotifyFestival,
		"notify_daily":    profile.NotifyDaily,
	}

	data, err := client.Insert("profiles", createData)
	if err != nil {
		log.Printf("Error creating user profile: %v", err)
		return nil, err
	}

	var users []User
	if err := json.Unmarshal(data, &users); err != nil {
		log.Printf("Error unmarshaling created user: %v", err)
		return nil, err
	}

	if len(users) == 0 {
		return nil, nil
	}

	return &users[0], nil
}

// Delete removes a user's profile
func (s *Service) Delete(ctx context.Context, userID string) error {
	client := database.GetClient()

	query := fmt.Sprintf("id=eq.%s", url.QueryEscape(userID))
	if err := client.Delete("profiles", query); err != nil {
		log.Printf("Error deleting user profile: %v", err)
		return err
	}

	return nil
}
