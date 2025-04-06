package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Alerta struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	RouteID     bson.ObjectID `bson:"route_id" json:"route_id"`
	Type        string        `bson:"type" json:"type"`
	Description string        `bson:"description" json:"description"`
	CreatedAt   time.Time     `bson:"created_at" json:"created_at"`
}
