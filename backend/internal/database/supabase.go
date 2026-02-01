package database

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/digipandit/backend/internal/config"
)

// SupabaseClient is a simple HTTP client for Supabase
type SupabaseClient struct {
	baseURL    string
	anonKey    string
	serviceKey string
	httpClient *http.Client
}

var client *SupabaseClient

// InitSupabase initializes the Supabase client
func InitSupabase(cfg *config.Config) *SupabaseClient {
	client = &SupabaseClient{
		baseURL:    cfg.SupabaseURL,
		anonKey:    cfg.SupabaseAnonKey,
		serviceKey: cfg.SupabaseServiceKey,
		httpClient: &http.Client{},
	}
	return client
}

// GetClient returns the Supabase client instance
func GetClient() *SupabaseClient {
	return client
}

// Query executes a query on a Supabase table
func (c *SupabaseClient) Query(table string, query string) ([]byte, error) {
	url := fmt.Sprintf("%s/rest/v1/%s?%s", c.baseURL, table, query)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", c.serviceKey)
	req.Header.Set("Authorization", "Bearer "+c.serviceKey)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return io.ReadAll(resp.Body)
}

// QuerySingle executes a query expecting a single result
func (c *SupabaseClient) QuerySingle(table string, query string) ([]byte, error) {
	url := fmt.Sprintf("%s/rest/v1/%s?%s", c.baseURL, table, query)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", c.serviceKey)
	req.Header.Set("Authorization", "Bearer "+c.serviceKey)
	req.Header.Set("Accept", "application/vnd.pgrst.object+json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == 406 {
		return nil, fmt.Errorf("not found")
	}

	return io.ReadAll(resp.Body)
}

// Insert inserts data into a table
func (c *SupabaseClient) Insert(table string, data interface{}) ([]byte, error) {
	url := fmt.Sprintf("%s/rest/v1/%s", c.baseURL, table)

	body, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", c.serviceKey)
	req.Header.Set("Authorization", "Bearer "+c.serviceKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return io.ReadAll(resp.Body)
}

// Update updates data in a table
func (c *SupabaseClient) Update(table string, query string, data interface{}) ([]byte, error) {
	url := fmt.Sprintf("%s/rest/v1/%s?%s", c.baseURL, table, query)

	body, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("PATCH", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", c.serviceKey)
	req.Header.Set("Authorization", "Bearer "+c.serviceKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return io.ReadAll(resp.Body)
}

// Delete deletes data from a table
func (c *SupabaseClient) Delete(table string, query string) error {
	url := fmt.Sprintf("%s/rest/v1/%s?%s", c.baseURL, table, query)

	req, err := http.NewRequest("DELETE", url, nil)
	if err != nil {
		return err
	}

	req.Header.Set("apikey", c.serviceKey)
	req.Header.Set("Authorization", "Bearer "+c.serviceKey)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return nil
}
