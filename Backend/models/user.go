package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Usuario struct {
	ID       bson.ObjectID `bson:"_id,omitempty" json:"_id"`
	Name     string        `bson:"name" json:"name"`
	Email    string        `bson:"email" json:"email"`
	Password string        `bson:"password" json:"password"`
	Phone    string        `bson:"phone" json:"phone"`
	Roles    []string      `bson:"roles" json:"roles"`
}
