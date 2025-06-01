package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type PuntoAyuda struct {
	ID           bson.ObjectID  `bson:"_id,omitempty" json:"_id"`
	RouteID      bson.ObjectID  `bson:"route_id" json:"route_id"`
	Coords       []float64      `bson:"coords" json:"coords"`
	DateRegister time.Time      `bson:"date_register" json:"date_register"`
	PeopleHelped PersonaAyudada `bson:"people_helped" json:"people_helped"`
}
