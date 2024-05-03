package handler

import (
	"fmt"
	"net/http"

	"image"
	"image/jpeg"
	_ "image/png" // Register PNG decoder

	"github.com/nfnt/resize"
)

// Get an image from the supplied url and return it shrunk to 100x100 pixels
func AvatarHandler(w http.ResponseWriter, r *http.Request) {
	// Get the URL from the query string
	url := r.URL.Query().Get("url")

	if url == "" {
		http.Error(w, "No URL provided", http.StatusBadRequest)
		return
	}

	// Get the image from the URL
	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Error getting image", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Decode the image
	img, _, err := image.Decode(resp.Body)
	if err != nil {
		fmt.Printf("Error decoding image: %v\n", err)
		http.Error(w, "Error decoding image", http.StatusInternalServerError)
		return
	}

	// Resize the image
	resizedImg := resize.Resize(100, 100, img, resize.Lanczos3)

	// Write the resized image to the response
	w.Header().Set("Content-Type", "image/jpeg")
	err = jpeg.Encode(w, resizedImg, nil)
	if err != nil {
		http.Error(w, "Error writing image to response", http.StatusInternalServerError)
		return
	}
}
