package services

import (
	"backend/Backend/models"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"time"
)

type RiskService interface {
	GetRisks() ([]models.Riesgo, error)
	CreateRisk(risk models.Riesgo) error
	DeleteRisk(id string) error
	UpdateRisk(updateData map[string]interface{}) (models.Riesgo, error)
}

type RiskServiceImpl struct {
	RiskCollection *mongo.Collection
}

func NewRiskServiceImpl(riskCollection *mongo.Collection) RiskService {
	return &RiskServiceImpl{
		RiskCollection: riskCollection,
	}
}

func (s *RiskServiceImpl) GetRisks() ([]models.Riesgo, error) {
	cursor, err := s.RiskCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var risks []models.Riesgo
	for cursor.Next(context.Background()) {
		var risk models.Riesgo
		if err := cursor.Decode(&risk); err != nil {
			return nil, err
		}
		risks = append(risks, risk)
	}
	return risks, nil
}

func (s *RiskServiceImpl) CreateRisk(risk models.Riesgo) error {
	risk.ID = bson.NewObjectID()
	risk.DateRegister = time.Now()
	_, err := s.RiskCollection.InsertOne(context.Background(), risk)
	return err
}

func (s *RiskServiceImpl) DeleteRisk(id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de riesgo inválido")
	}
	_, err = s.RiskCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (s *RiskServiceImpl) UpdateRisk(updateData map[string]interface{}) (models.Riesgo, error) {
	idStr, ok := updateData["_id"].(string)
	if !ok {
		return models.Riesgo{}, errors.New("ID de riesgo no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return models.Riesgo{}, errors.New("ID de riesgo inválido")
	}
	delete(updateData, "_id")

	update := bson.M{"$set": updateData}
	_, err = s.RiskCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return models.Riesgo{}, err
	}

	var updatedRisk models.Riesgo
	err = s.RiskCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedRisk)
	if err != nil {
		return models.Riesgo{}, err
	}
	return updatedRisk, nil
}
