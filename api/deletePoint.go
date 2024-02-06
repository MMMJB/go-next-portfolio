package handler

import (
	L "github.com/MMMJB/go-next-portfolio/lib"

	"context"
	"fmt"
	"net/http"

	s "strconv"
	// "os"
	// "io"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func DeletePoint(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	L.ConnectToMongo(func(collection *mongo.Collection) {
		// Extract point data from query parameters
		params := r.URL.Query()

		lat := params.Get("lat")
		lng := params.Get("lng")

		// Return error if any fields are empty
		if lat == "" || lng == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		// Convert lat and lng to integers
		latInt, err := s.Atoi(lat)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Printf("Error converting lat to integer: %v\n", err)
			return
		}

		lngInt, err := s.Atoi(lng)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Printf("Error converting lng to integer: %v\n", err)
			return
		}

		// Create a filter for the point to be deleted
		filter := bson.D{{"lat", latInt}, {"lng", lngInt}}

		// Delete the point
		_, err = collection.DeleteOne(context.TODO(), filter)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Printf("Error deleting point: %v\n", err)
			return
		}

		w.WriteHeader(http.StatusOK)
	})
}
