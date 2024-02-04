package handler

import (
	L "github.com/MMMJB/go-next-portfolio/lib"

	"context"
	"encoding/json"
	"fmt"
	"net/http"

	// "os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

func Points(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Create points array
	var points []bson.M

	L.ConnectToMongo(func(collection *mongo.Collection) {
		// Find all documents in the collection
		cursor, err := collection.Find(context.TODO(), bson.D{})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Printf("Error finding documents in collection: %v\n", err)
			return
		}

		// Iterate through the cursor and write to the response writer
		for cursor.Next(context.Background()) {
			var result bson.M

			err := cursor.Decode(&result)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Printf("Error decoding document: %v\n", err)
				return
			}

			points = append(points, result)
		}
	})

	// Convert the points array to a JSON object
	json, err := json.Marshal(points)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Printf("Error converting points to JSON: %v\n", err)
		return
	}

	w.WriteHeader(http.StatusOK)

	// Write the JSON object to the response writer
	w.Write(json)
}
