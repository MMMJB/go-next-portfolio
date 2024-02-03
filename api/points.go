package handler

import (
	L "github.com/MMMJB/go-next-portfolio/lib"

	"context"
	"fmt"
	"net/http"

	// "os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

func Points(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	L.ConnectToMongo(func(collection *mongo.Collection) {
		// Find all documents in the collection
		cursor, err := collection.Find(context.TODO(), bson.D{})
		if err != nil {
			fmt.Errorf("Error finding documents in collection: %v", err)
		}

		// Iterate through the cursor and write to the response writer
		for cursor.Next(context.Background()) {
			var result bson.M

			err := cursor.Decode(&result)
			if err != nil {
				fmt.Errorf("Error decoding document: %v", err)
			}

			fmt.Fprintf(w, "%v\n", result)
		}
	})
}
