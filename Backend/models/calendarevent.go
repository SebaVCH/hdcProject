package models

import "time"

type EventoCalendario struct {
	ID          string    `bson:"_id,omitempty" json:"_id,omitempty"`
	Title       string    `bson:"title" json:"title"`
	Description string    `bson:"description" json:"description"`
	DateStart   time.Time `bson:"date_start" json:"date_start"`
}
