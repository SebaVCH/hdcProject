package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Route struct {
	ID          bson.ObjectID   `bson:"_id,omitempty" json:"_id,omitempty"`
	Description string          `bson:"description" json:"description"`
	RouteLeader bson.ObjectID   `bson:"route_leader" json:"route_leader"`
	Team        []bson.ObjectID `bson:"team" json:"team"`
	HelpPoints  []PuntoAyuda    `bson:"help_points" json:"help_points"`
	Status      string          `bson:"status" json:"status"`
	DateCreated time.Time       `bson:"date_created" json:"date_created"`
	Alert       bson.ObjectID   `bson:"alert" json:"alert"`
}
