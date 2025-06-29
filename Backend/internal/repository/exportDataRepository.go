package repository

import (
	"context"
	"github.com/SebaVCH/hdcProject/internal/domain"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type ExportDataRepository interface {
	GetPeopleHelpedData() ([]domain.PersonaAyudada, error)
}

type exportDataRepository struct {
	PeopleHelpedCollection *mongo.Collection
}

func NewExportDataRepository(collection *mongo.Collection) ExportDataRepository {
	return &exportDataRepository{
		PeopleHelpedCollection: collection,
	}
}

func (ed *exportDataRepository) GetPeopleHelpedData() ([]domain.PersonaAyudada, error) {
	cursor, err := ed.PeopleHelpedCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var peopleHelped []domain.PersonaAyudada
	for cursor.Next(context.Background()) {
		var person domain.PersonaAyudada
		if err := cursor.Decode(&person); err != nil {
			return nil, err
		}
		peopleHelped = append(peopleHelped, person)
	}
	return peopleHelped, nil
}
