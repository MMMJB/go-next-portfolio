package handler

import (
	L "github.com/MMMJB/go-next-portfolio/lib"

	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type GithubAccessTokenResponse struct {
	AccessToken string `json:"access_token"`
}

func getAccessToken(code string) string {
	// Get the client ID and secret from the environment
	clientID := L.GetEnv("GITHUB_CLIENT_ID")
	clientSecret := L.GetEnv("GITHUB_CLIENT_SECRET")

	// Set the request body as JSON
	body := map[string]string{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"code":          code,
	}
	bodyJSON, _ := json.Marshal(body)

	// Create a new request to get the access token
	req, err := http.NewRequest(
		"POST",
		"https://github.com/login/oauth/access_token",
		bytes.NewBuffer(bodyJSON),
	)
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return ""
	}

	// Set the request headers
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	// Send the request
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return ""
	}

	// Decode the response body
	respBody, _ := io.ReadAll(resp.Body)

	var accessTokenResponse GithubAccessTokenResponse
	json.Unmarshal(respBody, &accessTokenResponse)

	return accessTokenResponse.AccessToken
}

func getUserData(accessToken string) string {
	// Create a new request to get the user data
	req, err := http.NewRequest(
		"GET",
		"https://api.github.com/user",
		nil,
	)
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return ""
	}

	// Set the request headers
	authorization := fmt.Sprintf("token %s", accessToken)
	req.Header.Set("Authorization", authorization)

	// Send the request
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		return ""
	}

	// Decode the response body
	respBody, _ := io.ReadAll(resp.Body)

	// Return the response body as a string (for now)
	return string(respBody)
}

func GithubAuthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract code query parameter
	code := r.URL.Query().Get("code")

	githubAccessToken := getAccessToken(code)
	if githubAccessToken == "" {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	userData := getUserData(githubAccessToken)
	if userData == "" {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write([]byte(userData))
	w.WriteHeader(http.StatusOK)
}
