package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var Client *mongo.Client

func StartDB() error {
	var uri string

	if uri = os.Getenv("MONGODB_URI"); uri == "" {
		log.Fatal("Error al obtener la URI del la DB")
	}

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(opts)

	if err != nil {
		return err
	}

	if err = client.Ping(ctx, nil); err != nil {
		return err
	}

	Client = client
	log.Println("Conectado a MongoDB correctamente")
	return nil
}
