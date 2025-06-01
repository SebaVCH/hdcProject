package repository

import (
	"backend/Backend/internal/domain"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type HelpPointRepository interface {
	GetAllPoints() ([]domain.PuntoAyuda, error)
	CreateHelpingPoint(helpPoint domain.PuntoAyuda) error
	UpdateHelpingPoint(data map[string]interface{}) (domain.PuntoAyuda, error)
	DeleteHelpingPoint(id string) error
}

type helpPointRepository struct {
	HelpPointCollection     *mongo.Collection
	PeopleHelpedCollections *mongo.Collection
}

func NewHelpPointRepository(helpPointCollection *mongo.Collection, peopleHelpedCollection *mongo.Collection) HelpPointRepository {
	return &helpPointRepository{
		HelpPointCollection:     helpPointCollection,
		PeopleHelpedCollections: peopleHelpedCollection,
	}
}

func (h *helpPointRepository) CreateHelpingPoint(helpPoint domain.PuntoAyuda) error {
	helpPoint.ID = bson.NewObjectID()
	_, err := h.HelpPointCollection.InsertOne(context.Background(), helpPoint)
	if err != nil {
		return err
	}
	personHelped := helpPoint.PeopleHelped
	_, err = h.PeopleHelpedCollections.InsertOne(context.Background(), personHelped)
	if err != nil {
		return err
	}
	return nil
}

func (h *helpPointRepository) UpdateHelpingPoint(data map[string]interface{}) (domain.PuntoAyuda, error) {
	idStr, ok := data["_id"].(string)
	if !ok {
		return domain.PuntoAyuda{}, errors.New("ID de punto de ayuda no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return domain.PuntoAyuda{}, errors.New("ID de punto de ayuda inválido")
	}
	delete(data, "_id")

	update := bson.M{"$set": data}
	_, err = h.HelpPointCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return domain.PuntoAyuda{}, err
	}

	var updatedHelpPoint domain.PuntoAyuda
	err = h.HelpPointCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedHelpPoint)
	if err != nil {
		return domain.PuntoAyuda{}, err
	}
	return updatedHelpPoint, nil
}

func (h *helpPointRepository) DeleteHelpingPoint(id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de punto de ayuda inválido")
	}
	_, err = h.HelpPointCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (h *helpPointRepository) GetAllPoints() ([]domain.PuntoAyuda, error) {
	cursor, err := h.HelpPointCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var helpPoints []domain.PuntoAyuda
	for cursor.Next(context.Background()) {
		var helpPoint domain.PuntoAyuda
		if err := cursor.Decode(&helpPoint); err != nil {
			return nil, err
		}
		helpPoints = append(helpPoints, helpPoint)
	}
	return helpPoints, nil
}
