package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"time"
)

type PuntoAyuda struct {
	ID              bson.ObjectID    `bson:"_id,omitempty"`
	Coords          []float64        `bson:"coords"`
	DateRegister    time.Time        `bson:"date_register"`
	PeopleHelped    []PersonaAyudada `bson:"people_helped"`
	LastTimeVisited time.Time        `bson:"last_time_visited"`
}
