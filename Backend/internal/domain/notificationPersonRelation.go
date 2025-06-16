package domain

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"time"
)

type NotificationPersonRelation struct {
	ID             bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	NotificationID bson.ObjectID `bson:"notification_id" json:"notification_id"`
	PersonID       bson.ObjectID `bson:"person_id" json:"person_id"`
	ReadAt         time.Time     `bson:"created_at" json:"created_at"`
	Read           bool          `bson:"read" json:"read"`
}
