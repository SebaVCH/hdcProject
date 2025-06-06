package domain

import "go.mongodb.org/mongo-driver/v2/bson"

type Usuario struct {
	ID              bson.ObjectID `bson:"_id,omitempty" json:"_id"`
	Name            string        `bson:"name" json:"name"`
	Email           string        `bson:"email" json:"email"`
	Password        string        `bson:"password" json:"password"`
	Phone           string        `bson:"phone" json:"phone"`
	CompletedRoutes int           `bson:"completed_routes" json:"completed_routes"`
	ListRoutes      []Route       `bson:"list_routes" json:"list_routes"`
	Role            string        `bson:"role" json:"role"`
	Institution     string        `bson:"institution" json:"institution"`
}
