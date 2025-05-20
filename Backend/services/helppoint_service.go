package services

import (
	"backend/Backend/models"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type HelpPointService interface {
	GetAllPoints() ([]models.PuntoAyuda, error)
	CreateHelpingPoint(helpPoint models.PuntoAyuda) error
	UpdateHelpingPoint(data map[string]interface{}) (models.PuntoAyuda, error)
	DeleteHelpingPoint(id string) error
}

type HelpPointServiceImpl struct {
	HelpPointCollection *mongo.Collection
}

func NewHelpPointServiceImpl(helpPointCollection *mongo.Collection) HelpPointService {
	return &HelpPointServiceImpl{
		HelpPointCollection: helpPointCollection,
	}
}

func (h *HelpPointServiceImpl) CreateHelpingPoint(helpPoint models.PuntoAyuda) error {
	helpPoint.ID = bson.NewObjectID()
	_, err := h.HelpPointCollection.InsertOne(context.Background(), helpPoint)
	return err
}

func (h *HelpPointServiceImpl) UpdateHelpingPoint(data map[string]interface{}) (models.PuntoAyuda, error) {
	idStr, ok := data["_id"].(string)
	if !ok {
		return models.PuntoAyuda{}, errors.New("ID de punto de ayuda no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return models.PuntoAyuda{}, errors.New("ID de punto de ayuda inválido")
	}
	delete(data, "_id")

	update := bson.M{"$set": data}
	_, err = h.HelpPointCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return models.PuntoAyuda{}, err
	}

	var updatedHelpPoint models.PuntoAyuda
	err = h.HelpPointCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedHelpPoint)
	if err != nil {
		return models.PuntoAyuda{}, err
	}
	return updatedHelpPoint, nil
}

func (h *HelpPointServiceImpl) DeleteHelpingPoint(id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de punto de ayuda inválido")
	}
	_, err = h.HelpPointCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (h *HelpPointServiceImpl) GetAllPoints() ([]models.PuntoAyuda, error) {
	cursor, err := h.HelpPointCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var helpPoints []models.PuntoAyuda
	for cursor.Next(context.Background()) {
		var helpPoint models.PuntoAyuda
		if err := cursor.Decode(&helpPoint); err != nil {
			return nil, err
		}
		helpPoints = append(helpPoints, helpPoint)
	}
	return helpPoints, nil
}
