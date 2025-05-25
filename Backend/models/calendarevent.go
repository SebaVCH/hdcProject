package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"time"
)

type EventoCalendario struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Title       string        `bson:"title" json:"title"`
	Description string        `bson:"description" json:"description"`
	DateStart   time.Time     `bson:"date_start" json:"date_start"`
}
