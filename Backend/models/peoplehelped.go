package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type PersonaAyudada struct {
	ID     bson.ObjectID `bson:"_id,omitempty" json:"_id"`
	Age    int           `bson:"age" json:"age"`
	Gender string        `bson:"gender" json:"gender"`
	Date   time.Time     `bson:"date" json:"date"`
}
