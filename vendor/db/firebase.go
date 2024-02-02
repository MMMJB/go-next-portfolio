package main

import (
	"context"
	"fmt"
	"os"

	"github.com/joho/godotenv"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/db"
	"google.golang.org/api/option"
)

type FireDB struct {
	*db.Client
}

var fireDb FireDB

func init() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found")
	}
}

func (db *FireDB) Connect() error {
	home, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("Error getting current directory: %v", err)
	}

	url, exists := os.LookupEnv("DATABASE_URL")
	if !exists {
		return fmt.Errorf("DATABASE_URL not found in environment.")
	}

	ctx := context.Background()
	opt := option.WithCredentialsFile(home + "/SAenv.json")
	config := &firebase.Config{DatabaseURL: url}
	
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		return fmt.Errorf("Error initializing app: %v", err)
	}

	client, err := app.Database(ctx)
	if err != nil {
		return fmt.Errorf("Error initializing database client: %v", err)
	}

	db.Client = client
	return nil
}

func FirebaseDB() *FireDB {
	return &fireDb
}