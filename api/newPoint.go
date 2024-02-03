package handler

import (
	// L "github.com/MMMJB/go-next-portfolio/lib"

	// "context"
	"fmt"
	"net/http"
	"reflect"

	// s "strconv"

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
	m := reflect.ValueOf(resp).Elem()

	// L.ConnectToMongo(func(collection *mongo.Collection) {
	// Extract point data from query parameters
	params := r.URL.Query()
	for k, v := range params {
		f := m.FieldByName(k)

		if f == (reflect.Value{}) {
			fmt.Errorf("Field not found: %v", k)
		} else {
			m.FieldByName(k).Set(reflect.ValueOf(v))
		}
	}

	json, err := bson.Marshal(resp)

	if err != nil {
		fmt.Errorf("Error marshalling response to JSON: %v", err)
	}

	w.Write(json)
	// })
}
