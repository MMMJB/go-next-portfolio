package handler

import (
	L "github.com/MMMJB/go-next-portfolio/lib"

	"context"
	"fmt"
	"net/http"

	s "strconv"
	// "os"
	// "io"
	"go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

type Point struct {
	Lat int    `bson:"lat"`
	Lng int    `bson:"lng"`
	Col string `bson:"col"`
}

func NewPoint(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	p := new(Point)

	L.ConnectToMongo(func(collection *mongo.Collection) {
		// Extract point data from query parameters
		params := r.URL.Query()

		lat := params.Get("lat")
		lng := params.Get("lng")
		col := params.Get("col")

		// Return error if any fields are empty
		if lat == "" || lng == "" || col == "" {
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

		// Create a new point
		p.Lat = latInt
		p.Lng = lngInt
		p.Col = col

		// Insert the point into the database
		_, err = collection.InsertOne(context.TODO(), p)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Printf("Error inserting point into database: %v\n", err)
			return
		}

		w.WriteHeader(http.StatusOK)
	})
}
