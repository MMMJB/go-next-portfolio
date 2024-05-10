package lib

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Utility function for getting environment variable
func GetEnv(key string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		fmt.Printf("No '%s' environment variable found.\n", key)
	}

	return value
}

// Utility function for connecting to the MongoDB client and executing a function on the collection
func ConnectToMongo(function func(*mongo.Collection)) {
	// Get mongo environment variable
	uri := GetEnv("MONGO_URI")

	// Connect to MongoDB client
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Errorf("Error connecting to MongoDB: %v", err)
	}

	// Disconnect from MongoDB client after function ends
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Errorf("Error disconnecting from MongoDB: %v", err)
		}
	}()

	// Get the database and collection
	collection := client.Database("development").Collection("visitors")

	// Call the function with the collection
	function(collection)
}
