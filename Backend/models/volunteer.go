package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Voluntario struct {
	ID              bson.ObjectID `bson:"_id,omitempty"`
	Name            string        `bson:"name"`
	Email           string        `bson:"email"`
	Password        string        `bson:"password"`
	Phone           string        `bson:"phone"`
	CompletedRoutes int           `bson:"completed_routes"`
	ListRoutes      []Ruta        `bson:"list_routes"`
}
