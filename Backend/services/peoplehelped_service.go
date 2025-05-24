package services

import (
	"backend/Backend/models"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"time"
)

type PeopleHelpedService interface {
	GetPeopleHelped() ([]models.PersonaAyudada, error)
	CreatePersonHelped(person models.PersonaAyudada) error
	DeletePersonHelped(id string) error
	UpdatePersonHelped(updateData map[string]interface{}) (models.PersonaAyudada, error)
}

type PeopleHelpedServiceImpl struct {
	PeopleHelpedCollection *mongo.Collection
}

func NewPeopleHelpedServiceImpl(collection *mongo.Collection) PeopleHelpedService {
	return &PeopleHelpedServiceImpl{
		PeopleHelpedCollection: collection,
	}
}

func (s *PeopleHelpedServiceImpl) GetPeopleHelped() ([]models.PersonaAyudada, error) {
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

func (s *PeopleHelpedServiceImpl) CreatePersonHelped(person models.PersonaAyudada) error {
	person.ID = bson.NewObjectID()
	person.DateRegister = time.Now()
	_, err := s.PeopleHelpedCollection.InsertOne(context.Background(), person)
	return err
}

func (s *PeopleHelpedServiceImpl) DeletePersonHelped(id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de persona ayudada inválido")
	}
	_, err = s.PeopleHelpedCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (s *PeopleHelpedServiceImpl) UpdatePersonHelped(updateData map[string]interface{}) (models.PersonaAyudada, error) {
	idStr, ok := updateData["_id"].(string)
	if !ok {
		return models.PersonaAyudada{}, errors.New("ID de persona ayudada no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return models.PersonaAyudada{}, errors.New("ID de persona ayudada inválido")
	}
	delete(updateData, "_id")

	update := bson.M{"$set": updateData}
	_, err = s.PeopleHelpedCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return models.PersonaAyudada{}, err
	}

	var updatedPerson models.PersonaAyudada
	err = s.PeopleHelpedCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedPerson)
	if err != nil {
		return models.PersonaAyudada{}, err
	}
	return updatedPerson, nil
}
