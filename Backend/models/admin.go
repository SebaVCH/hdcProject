package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Admin struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"_id"`
	UsuarioID bson.ObjectID `bson:"usuario_id" json:"usuario_id"`
}
