package handler

import (
	// L "github.com/MMMJB/go-next-portfolio/lib"

	// "context"
	"fmt"
	"net/http"

	s "strconv"

	// "os"
	// "io"
	"go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

type Point struct {
	lat int    `bson:"lat"`
	lng int    `bson:"lng"`
	col string `bson:"col"`
}

func NewPoint(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	resp := new(Point)

	// L.ConnectToMongo(func(collection *mongo.Collection) {
	// Extract point data from query parameters
	params := r.URL.Query()

	lat := params.Get("lat")
	lng := params.Get("lng")
	col := params.Get("col")

	// Convert lat and lng to integers
	latInt, err := s.Atoi(lat)
	if err != nil {
		fmt.Errorf("Error converting lat to integer: %v", err)
	}

	lngInt, err := s.Atoi(lng)
	if err != nil {
		fmt.Errorf("Error converting lng to integer: %v", err)
	}

	// Create a new point
	resp.lat = latInt
	resp.lng = lngInt
	resp.col = col

	json, err := bson.Marshal(resp)

	if err != nil {
		fmt.Errorf("Error marshalling response to JSON: %v", err)
	}

	w.Write(json)
	// })
}
