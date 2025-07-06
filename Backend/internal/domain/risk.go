package domain

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"time"
)

type Riesgo struct {
	ID           bson.ObjectID `bson:"_id,omitempty" json:"_id"`
	AuthorID     bson.ObjectID `bson:"author_id" json:"author_id"`
	Coords       []float64     `bson:"coords" json:"coords"`
	Status       string        `bson:"Status" json:"Status"`
	DateRegister time.Time     `bson:"date_register" json:"date_register"`
	Description  string        `bson:"description" json:"description"`
}
