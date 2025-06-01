package repository

import (
	"backend/Backend/internal/domain"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"time"
)

type PeopleHelpedRepository interface {
	GetPeopleHelped() ([]domain.PersonaAyudada, error)
	CreatePersonHelped(person domain.PersonaAyudada) error
	DeletePersonHelped(id string) error
	UpdatePersonHelped(updateData map[string]interface{}) (domain.PersonaAyudada, error)
}

type peopleHelpedRepository struct {
	PeopleHelpedCollection *mongo.Collection
}

func NewPeopleHelpedRepository(collection *mongo.Collection) PeopleHelpedRepository {
	return &peopleHelpedRepository{
		PeopleHelpedCollection: collection,
	}
}

func (ph *peopleHelpedRepository) GetPeopleHelped() ([]domain.PersonaAyudada, error) {
	cursor, err := ph.PeopleHelpedCollection.Find(context.Background(), bson.M{})
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

func (ph *peopleHelpedRepository) CreatePersonHelped(person domain.PersonaAyudada) error {
	person.ID = bson.NewObjectID()
	person.DateRegister = time.Now()
	_, err := ph.PeopleHelpedCollection.InsertOne(context.Background(), person)
	return err
}

func (ph *peopleHelpedRepository) DeletePersonHelped(id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de persona ayudada inválido")
	}
	_, err = ph.PeopleHelpedCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (ph *peopleHelpedRepository) UpdatePersonHelped(updateData map[string]interface{}) (domain.PersonaAyudada, error) {
	idStr, ok := updateData["_id"].(string)
	if !ok {
		return domain.PersonaAyudada{}, errors.New("ID de persona ayudada no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return domain.PersonaAyudada{}, errors.New("ID de persona ayudada inválido")
	}
	delete(updateData, "_id")

	update := bson.M{"$set": updateData}
	_, err = ph.PeopleHelpedCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return domain.PersonaAyudada{}, err
	}

	var updatedPerson domain.PersonaAyudada
	err = ph.PeopleHelpedCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedPerson)
	if err != nil {
		return domain.PersonaAyudada{}, err
	}
	return updatedPerson, nil
}
