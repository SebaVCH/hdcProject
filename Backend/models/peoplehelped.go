package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"time"
)

type PersonaAyudada struct {
	ID     bson.ObjectID `bson:"_id,omitempty"`
	Name   string        `bson:"name"`
	Age    int           `bson:"age"`
	Gender string        `bson:"gender"`
	Date   time.Time     `bson:"date"`
}
