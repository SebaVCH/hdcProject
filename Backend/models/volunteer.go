package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Voluntario struct {
	ID              bson.ObjectID `bson:"_id,omitempty" json:"_id"`
	UsuarioID       bson.ObjectID `bson:"usuario_id" json:"usuario_id"`
	CompletedRoutes int           `bson:"completed_routes" json:"completed_routes"`
	ListRoutes      []Route       `bson:"list_routes" json:"list_routes"`
}
