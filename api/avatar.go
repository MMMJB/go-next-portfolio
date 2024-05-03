package handler

import (
	"fmt"
	"net/http"

	"image"
	"image/color"
	"image/draw"
	"image/jpeg"
	_ "image/png" // Register PNG decoder

	"github.com/nfnt/resize"
)

// From https://github.com/tufteddeer/go-circleimage/blob/da7082266f97/circleImage.go
type circle struct {
	p image.Point
	r int
}

func (c *circle) ColorModel() color.Model {
	return color.AlphaModel
}

func (c *circle) Bounds() image.Rectangle {
	return image.Rect(c.p.X-c.r, c.p.Y-c.r, c.p.X+c.r, c.p.Y+c.r)
}

func (c *circle) At(x, y int) color.Color {
	xx, yy, rr := float64(x-c.p.X)+0.5, float64(y-c.p.Y)+0.5, float64(c.r)
	if xx*xx+yy*yy < rr*rr {
		return color.Alpha{255}
	}
	return color.Alpha{0}
}

// CircleImage creates a new image from a round shape within the original
func CircleImage(source image.Image, origin image.Point, r int) image.Image {
	c := &circle{origin, r}
	result := image.NewRGBA(c.Bounds())

	draw.DrawMask(result, source.Bounds(), source, image.ZP, c, image.ZP, draw.Over)

	return result
}

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

	// Crop the image to a circle
	circleImg := CircleImage(resizedImg, image.Point{50, 50}, 50)

	// Write the resized image to the response
	w.Header().Set("Content-Type", "image/jpeg")
	err = jpeg.Encode(w, circleImg, nil)
	if err != nil {
		http.Error(w, "Error writing image to response", http.StatusInternalServerError)
		return
	}
}
