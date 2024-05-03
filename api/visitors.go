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

func Visitors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Create visitors array
	var visitors []bson.M

	L.ConnectToMongo(func(collection *mongo.Collection) {
		// Find all documents in the collection
		cursor, err := collection.Find(context.TODO(), bson.D{})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Printf("Error finding documents in collection: %v\n", err)
			return
		}

		// Iterate through the cursor and write to the visitors array
		for cursor.Next(context.Background()) {
			var result bson.M

			err := cursor.Decode(&result)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Printf("Error decoding document: %v\n", err)
				return
			}

			// Remove the email field from the result
			delete(result, "email")

			visitors = append(visitors, result)
		}
	})

	// Convert the visitors array to a JSON object
	json, err := json.Marshal(visitors)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Printf("Error converting visitors to JSON: %v\n", err)
		return
	}

	w.WriteHeader(http.StatusOK)

	w.Write(json)
}
