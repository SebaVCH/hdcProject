package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"time"
)

type Riesgo struct {
	ID           bson.ObjectID `bson:"_id,omitempty" json:"_id"`
	Coords       []float64     `bson:"coords" json:"coords"`
	DateRegister time.Time     `bson:"date_register" json:"date_register"`
	Description  string        `bson:"description" json:"description"`
}
