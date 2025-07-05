package domain

import "go.mongodb.org/mongo-driver/v2/bson"

type Institution struct {
	ID    bson.ObjectID `bson:"_id,omitempty" json:"_id"`
	Name  string        `bson:"name" json:"name"`
	Color string        `bson:"color" json:"color"`
}
