package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"time"
)

type Alerta struct {
	ID          bson.ObjectID `bson:"_id,omitempty"`
	RouteID     bson.ObjectID `bson:"route_id"`
	Type        string        `bson:"type"`
	Description string        `bson:"description"`
	CreatedAt   time.Time     `bson:"created_at"`
}
