package repository

import (
	"context"
	"errors"
	"github.com/SebaVCH/hdcProject/internal/domain"
	"github.com/SebaVCH/hdcProject/internal/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"time"
)

type NotificationRepository interface {
	CreateNotification(notification domain.Aviso) error
	DeleteNotification(notificationID string) error
	UpdateNotification(data map[string]interface{}) (domain.Aviso, error)
	GetNotifications() ([]domain.Aviso, error)
	FindByIDAndUserID(id string, userID string) error
	GetUnreadNotifications(userID string) ([]domain.Aviso, error)
	GetReadNotifications(userID string) ([]domain.Aviso, error)
	MarkNotificationAsRead(notificationID string, userID string) error
}

type notificationRepository struct {
	NotificationsCollection              *mongo.Collection
	UserCollection                       *mongo.Collection
	NotificationPersonRelationCollection *mongo.Collection
}

func NewNotificationRepository(notificationsCollection, usersCollection, notificationUserRelation *mongo.Collection) NotificationRepository {
	return &notificationRepository{
		NotificationsCollection:              notificationsCollection,
		UserCollection:                       usersCollection,
		NotificationPersonRelationCollection: notificationUserRelation,
	}
}

func (n *notificationRepository) CreateNotification(notification domain.Aviso) error {
	notification.ID = bson.NewObjectID()
	notification.CreatedAt = time.Now()
	_, err := n.NotificationsCollection.InsertOne(context.Background(), notification)
	if err != nil {
		return err
	}

	cursor, err := n.UserCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var user domain.Usuario
		if err := cursor.Decode(&user); err != nil {
			continue
		}

		relation := domain.NotificationPersonRelation{
			ID:             bson.NewObjectID(),
			NotificationID: notification.ID,
			PersonID:       user.ID,
			Read:           false,
			ReadAt:         time.Time{},
		}
		_, _ = n.NotificationPersonRelationCollection.InsertOne(context.Background(), relation)

		if notification.SendEmail {
			go utils.SendNotificationMail(user, notification)
		}
	}

	return nil
}

func (n *notificationRepository) DeleteNotification(notificationID string) error {
	objID, err := bson.ObjectIDFromHex(notificationID)
	if err != nil {
		return errors.New("ID de notificación inválido")
	}
	_, err = n.NotificationsCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (n *notificationRepository) UpdateNotification(data map[string]interface{}) (domain.Aviso, error) {
	idStr, ok := data["_id"].(string)
	if !ok {
		return domain.Aviso{}, errors.New("ID de notificación no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return domain.Aviso{}, errors.New("ID de notificación inválido")
	}
	delete(data, "_id")

	update := bson.M{"$set": data}
	_, err = n.NotificationsCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return domain.Aviso{}, err
	}

	var updatedNotification domain.Aviso
	err = n.NotificationsCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedNotification)
	if err != nil {
		return domain.Aviso{}, err
	}
	return updatedNotification, nil
}

func (n *notificationRepository) GetNotifications() ([]domain.Aviso, error) {
	cursor, err := n.NotificationsCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var notifications []domain.Aviso
	for cursor.Next(context.Background()) {
		var notification domain.Aviso
		if err := cursor.Decode(&notification); err != nil {
			return nil, err
		}
		notifications = append(notifications, notification)
	}
	return notifications, nil
}

func (n *notificationRepository) FindByIDAndUserID(id string, userID string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de evento de calendario inválido")
	}

	var aviso domain.Aviso
	filter := bson.M{"_id": objID, "author_id": userID}
	err = n.NotificationsCollection.FindOne(context.Background(), filter).Decode(&aviso)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("evento no encontrado o no autorizado")
		}
		return err
	}
	return nil
}

func (n *notificationRepository) GetUnreadNotifications(userID string) ([]domain.Aviso, error) {
	userObjID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return nil, errors.New("ID de usuario inválido")
	}

	cursor, err := n.NotificationPersonRelationCollection.Find(
		context.Background(),
		bson.M{"person_id": userObjID, "read": false},
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var relations []domain.NotificationPersonRelation
	for cursor.Next(context.Background()) {
		var rel domain.NotificationPersonRelation
		if err := cursor.Decode(&rel); err != nil {
			continue
		}
		relations = append(relations, rel)
	}

	var notifications []domain.Aviso
	for _, rel := range relations {
		var notif domain.Aviso
		err := n.NotificationsCollection.FindOne(
			context.Background(),
			bson.M{"_id": rel.NotificationID},
		).Decode(&notif)
		if err == nil {
			notifications = append(notifications, notif)
		}
	}
	return notifications, nil
}

func (n *notificationRepository) GetReadNotifications(userID string) ([]domain.Aviso, error) {
	userObjID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return nil, errors.New("ID de usuario inválido")
	}

	cursor, err := n.NotificationPersonRelationCollection.Find(
		context.Background(),
		bson.M{"person_id": userObjID, "read": true},
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var relations []domain.NotificationPersonRelation
	for cursor.Next(context.Background()) {
		var rel domain.NotificationPersonRelation
		if err := cursor.Decode(&rel); err != nil {
			continue
		}
		relations = append(relations, rel)
	}

	var notifications []domain.Aviso
	for _, rel := range relations {
		var notif domain.Aviso
		err := n.NotificationsCollection.FindOne(
			context.Background(),
			bson.M{"_id": rel.NotificationID},
		).Decode(&notif)
		if err == nil {
			notifications = append(notifications, notif)
		}
	}
	return notifications, nil
}

func (n *notificationRepository) MarkNotificationAsRead(notificationID string, userID string) error {
	notifObjID, err := bson.ObjectIDFromHex(notificationID)
	if err != nil {
		return errors.New("ID de notificación inválido")
	}
	userObjID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return errors.New("ID de usuario inválido")
	}

	filter := bson.M{
		"notification_id": notifObjID,
		"person_id":       userObjID,
	}
	update := bson.M{
		"$set": bson.M{
			"read":    true,
			"read_at": time.Now(),
		},
	}
	_, err = n.NotificationPersonRelationCollection.UpdateOne(context.Background(), filter, update)
	return err
}
