package repository

import (
	"context"
	"errors"
	"github.com/SebaVCH/hdcProject/internal/domain"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type InstitutionRepository interface {
	GetAllInstitutions() ([]domain.Institution, error)
	GetInstitutionByID(id string) (domain.Institution, error)
	CreateInstitution(institution domain.Institution) error
	UpdateInstitution(id string, updateData map[string]interface{}) error
	DeleteInstitution(id string) error
}

type institutionRepository struct {
	InstitutionCollection *mongo.Collection
}

func NewInstitutionRepository(InstitutionCollection *mongo.Collection) InstitutionRepository {
	return &institutionRepository{
		InstitutionCollection: InstitutionCollection,
	}
}

func (i *institutionRepository) GetAllInstitutions() ([]domain.Institution, error) {
	var institutions []domain.Institution

	cursor, err := i.InstitutionCollection.Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	if err = cursor.All(context.TODO(), &institutions); err != nil {
		return nil, err
	}

	return institutions, nil
}

func (i *institutionRepository) GetInstitutionByID(id string) (domain.Institution, error) {
	var institution domain.Institution

	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return institution, err
	}

	filter := bson.D{{"_id", objectID}}
	err = i.InstitutionCollection.FindOne(context.TODO(), filter).Decode(&institution)
	if err != nil {
		return institution, err
	}

	return institution, nil
}

func (i *institutionRepository) CreateInstitution(institution domain.Institution) error {
	institution.ID = bson.NewObjectID()
	_, err := i.InstitutionCollection.InsertOne(context.TODO(), institution)
	return err
}

func (i *institutionRepository) UpdateInstitution(id string, updateData map[string]interface{}) error {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de institución inválido")
	}

	update := bson.M{"$set": updateData}
	_, err = i.InstitutionCollection.UpdateOne(context.TODO(), bson.M{"_id": objectID}, update)
	return err
}

func (i *institutionRepository) DeleteInstitution(id string) error {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	filter := bson.D{{"_id", objectID}}
	_, err = i.InstitutionCollection.DeleteOne(context.TODO(), filter)
	return err
}
