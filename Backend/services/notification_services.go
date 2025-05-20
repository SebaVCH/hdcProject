package services

import (
	"backend/Backend/models"
	"backend/Backend/utils"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"time"
)

type NotificationService interface {
	CreateNotification(notification models.Aviso) error
	DeleteNotification(notificationID string) error
	UpdateNotification(data map[string]interface{}) (models.Aviso, error)
	GetNotifications() ([]models.Aviso, error)
}

type NotificationServiceImpl struct {
	NotificationsCollection *mongo.Collection
	UserCollection          *mongo.Collection
}

func NewNotificationServiceImpl(notificationsCollection, usersCollection *mongo.Collection) NotificationService {
	return &NotificationServiceImpl{
		NotificationsCollection: notificationsCollection,
		UserCollection:          usersCollection,
	}
}

func (s *NotificationServiceImpl) CreateNotification(notification models.Aviso) error {
	notification.ID = bson.NewObjectID()
	notification.CreatedAt = time.Now()
	_, err := s.NotificationsCollection.InsertOne(
		context.Background(), notification,
	)
	if err != nil {
		return err
	}

	cursor, err := s.UserCollection.Find(
		context.Background(), bson.M{},
	)
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var user models.Usuario
		if err := cursor.Decode(&user); err != nil {
			continue
		}
		go utils.SendNotificationMail(user, notification)
	}

	return nil
}

func (s *NotificationServiceImpl) DeleteNotification(notificationID string) error {
	objID, err := bson.ObjectIDFromHex(notificationID)
	if err != nil {
		return errors.New("ID de notificationa inválido")
	}
	_, err = s.NotificationsCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (s *NotificationServiceImpl) UpdateNotification(data map[string]interface{}) (models.Aviso, error) {
	idStr, ok := data["_id"].(string)
	if !ok {
		return models.Aviso{}, errors.New("ID de notificacion no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return models.Aviso{}, errors.New("ID de notificacion inválido")
	}
	delete(data, "_id")

	update := bson.M{"$set": data}
	_, err = s.NotificationsCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return models.Aviso{}, err
	}

	var updatedNotification models.Aviso
	err = s.NotificationsCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedNotification)
	if err != nil {
		return models.Aviso{}, err
	}
	return updatedNotification, nil
}

func (s *NotificationServiceImpl) GetNotifications() ([]models.Aviso, error) {
	cursor, err := s.NotificationsCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var notifications []models.Aviso
	for cursor.Next(context.Background()) {
		var notification models.Aviso
		if err := cursor.Decode(&notification); err != nil {
			return nil, err
		}
		notifications = append(notifications, notification)
	}
	return notifications, nil
}
