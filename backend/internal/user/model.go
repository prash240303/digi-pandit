package user

import "time"

// User represents a user in the system
type User struct {
	ID             string     `json:"id"`
	Email          string     `json:"email"`
	Phone          string     `json:"phone,omitempty"`
	FullName       string     `json:"full_name,omitempty"`
	AvatarURL      string     `json:"avatar_url,omitempty"`
	DateOfBirth    *time.Time `json:"date_of_birth,omitempty"`
	ZodiacSign     string     `json:"zodiac_sign,omitempty"`
	Region         string     `json:"region,omitempty"`
	Language       string     `json:"language,omitempty"`
	IsPremium      bool       `json:"is_premium"`
	PremiumExpiry  *time.Time `json:"premium_expiry,omitempty"`
	NotifyFestival bool       `json:"notify_festival"`
	NotifyDaily    bool       `json:"notify_daily"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

// Profile contains user preferences and settings
type Profile struct {
	FullName       string     `json:"full_name" validate:"omitempty,min=2,max=100"`
	DateOfBirth    *time.Time `json:"date_of_birth"`
	ZodiacSign     string     `json:"zodiac_sign" validate:"omitempty,oneof=aries taurus gemini cancer leo virgo libra scorpio sagittarius capricorn aquarius pisces"`
	Region         string     `json:"region" validate:"omitempty,max=50"`
	Language       string     `json:"language" validate:"omitempty,oneof=en hi ta te mr gu bn kn"`
	NotifyFestival bool       `json:"notify_festival"`
	NotifyDaily    bool       `json:"notify_daily"`
}

// CreateProfileRequest represents the request to create a user profile
type CreateProfileRequest struct {
	Profile
}

// UpdateProfileRequest represents the request to update a user profile
type UpdateProfileRequest struct {
	Profile
}

// UserResponse represents the API response for user data
type UserResponse struct {
	User *User `json:"user"`
}

// ZodiacSigns is a list of valid zodiac signs
var ZodiacSigns = []string{
	"aries", "taurus", "gemini", "cancer",
	"leo", "virgo", "libra", "scorpio",
	"sagittarius", "capricorn", "aquarius", "pisces",
}

// SupportedLanguages maps language codes to names
var SupportedLanguages = map[string]string{
	"en": "English",
	"hi": "Hindi",
	"ta": "Tamil",
	"te": "Telugu",
	"mr": "Marathi",
	"gu": "Gujarati",
	"bn": "Bengali",
	"kn": "Kannada",
}

// Regions is a list of supported regions
var Regions = []string{
	"North India",
	"South India",
	"East India",
	"West India",
	"Central India",
	"Northeast India",
}
