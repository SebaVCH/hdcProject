package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"time"
)

type Ruta struct {
	ID          bson.ObjectID   `bson:"_id,omitempty"`
	Description string          `bson:"description"`
	RouteLeader bson.ObjectID   `bson:"route_leader"`
	Team        []bson.ObjectID `bson:"team"` // ID de los integrantes
	HelpPoints  []PuntoAyuda    `bson:"help_points"`
	Status      string          `bson:"status"`
	DateCreated time.Time       `bson:"date_created"`
	Alert       bson.ObjectID   `bson:"alert"`
}
