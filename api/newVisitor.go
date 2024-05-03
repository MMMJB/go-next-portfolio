package handler

import (
	L "github.com/MMMJB/go-next-portfolio/lib"

	"context"
	"fmt"
	"net/http"

	// s "strconv"
	// "os"
	// "io"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Visitor struct {
	Avatar  string `bson:"avatar"`
	Name    string `bson:"name"`
	Message string `bson:"message"`
	Email   string `bson:"email"`
}

func NewVisitor(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	v := new(Visitor)

	L.ConnectToMongo(func(collection *mongo.Collection) {
		// Extract visitor data from query parameters
		params := r.URL.Query()

		avatar := params.Get("avatar")
		name := params.Get("name")
		message := params.Get("message")
		email := params.Get("email")

		// Return error if any fields are empty
		if email == "" || avatar == "" || name == "" || message == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		// Create a new visitor
		v.Avatar = avatar
		v.Name = name
		v.Message = message
		v.Email = email

		// Check if a visitor with the same email already exists
		filter := bson.D{{"email", v.Email}}
		var result Visitor

		err := collection.FindOne(context.TODO(), filter).Decode(&result)
		if err == nil {
			// If a visitor with the same email exists, update it with the new data
			update := bson.D{{"$set", bson.D{{"avatar", v.Avatar}, {"name", v.Name}, {"message", v.Message}}}}

			_, err = collection.UpdateOne(context.TODO(), filter, update)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Printf("Error updating visitor in database: %v\n", err)
				return
			}
		} else {
			// Insert the visitor into the database
			_, err := collection.InsertOne(context.TODO(), v)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Printf("Error inserting visitor into database: %v\n", err)
				return
			}
		}

		w.WriteHeader(http.StatusOK)
	})
}
