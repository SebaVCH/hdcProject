package services

import (
	"backend/Backend/models"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"time"
)

type AlertService interface {
	CreateAlert(alert *models.Alerta) error
	DeleteAlert(alertID string) error
	UpdateAlert(data map[string]interface{}) (models.Alerta, error)
	GetAlerts() ([]models.Alerta, error)
}

type AlertServiceImpl struct {
	AlertsCollection *mongo.Collection
}

func NewAlertServiceImpl(alertsCollection *mongo.Collection) AlertService {
	return &AlertServiceImpl{AlertsCollection: alertsCollection}
}

func (s *AlertServiceImpl) CreateAlert(alert *models.Alerta) error {
	alert.ID = bson.NewObjectID()
	alert.CreatedAt = time.Now()
	_, err := s.AlertsCollection.InsertOne(context.Background(), alert)
	return err
}

func (s *AlertServiceImpl) DeleteAlert(alertID string) error {
	objID, err := bson.ObjectIDFromHex(alertID)
	if err != nil {
		return errors.New("ID de alerta inválido")
	}
	_, err = s.AlertsCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (s *AlertServiceImpl) UpdateAlert(data map[string]interface{}) (models.Alerta, error) {
	idStr, ok := data["_id"].(string)
	if !ok {
		return models.Alerta{}, errors.New("ID de alerta no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return models.Alerta{}, errors.New("ID de alerta inválido")
	}
	delete(data, "_id")

	update := bson.M{"$set": data}
	_, err = s.AlertsCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return models.Alerta{}, err
	}

	var updatedAlert models.Alerta
	err = s.AlertsCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedAlert)
	if err != nil {
		return models.Alerta{}, err
	}
	return updatedAlert, nil
}

func (s *AlertServiceImpl) GetAlerts() ([]models.Alerta, error) {
	cursor, err := s.AlertsCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var alerts []models.Alerta
	for cursor.Next(context.Background()) {
		var alert models.Alerta
		if err := cursor.Decode(&alert); err != nil {
			return nil, err
		}
		alerts = append(alerts, alert)
	}
	return alerts, nil
}
