package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type EventoCalendario struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Title       string        `bson:"title" json:"title"`
	Description string        `bson:"description" json:"description"`
	DateStart   time.Time     `bson:"date_start" json:"date_start"`
	AuthorID    bson.ObjectID `bson:"author_id" json:"author_id"`
	TimeStart   string        `bson:"time_start" json:"time_start"`
	TimeEnd     string        `bson:"time_end" json:"time_end"`
}
