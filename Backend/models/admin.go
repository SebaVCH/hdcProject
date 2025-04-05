package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Admin struct {
	ID       bson.ObjectID `bson:"_id,omitempty"` //Usare ID, no creo que el rut sea necesario dado que contamos tanto con el mail como con el telefono
	Name     string        `bson:"name"`
	Email    string        `bson:"email"`
	Password string        `bson:"password"`
	Phone    string        `bson:"phone"`
}
