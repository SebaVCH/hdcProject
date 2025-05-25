package services

import (
	"backend/Backend/models"
	"context"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type ExportDataService interface {
	GetPeopleHelpedData() ([]models.PersonaAyudada, error)
}

type ExportDataServiceImpl struct {
	PeopleHelpedCollection *mongo.Collection
}

func NewExportDataServiceImpl(collection *mongo.Collection) ExportDataService {
	return &ExportDataServiceImpl{
		PeopleHelpedCollection: collection,
	}
}

func (s *ExportDataServiceImpl) GetPeopleHelpedData() ([]models.PersonaAyudada, error) {
	cursor, err := s.PeopleHelpedCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var peopleHelped []models.PersonaAyudada
	for cursor.Next(context.Background()) {
		var person models.PersonaAyudada
		if err := cursor.Decode(&person); err != nil {
			return nil, err
		}
		peopleHelped = append(peopleHelped, person)
	}
	return peopleHelped, nil
}
