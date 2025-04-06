package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Admin struct {
	ID       bson.ObjectID `bson:"_id,omitempty" json:"_id"` //Usare ID, no creo que el rut sea necesario dado que contamos tanto con el mail como con el telefono
	Name     string        `bson:"name" json:"name"`
	Email    string        `bson:"email" json:"email"`
	Password string        `bson:"password" json:"password"`
	Phone    string        `bson:"phone" json:"phone"`
}
