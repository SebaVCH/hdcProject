package repository

import (
	"backend/Backend/internal/domain"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"time"
)

type RiskRepository interface {
	GetRisks() ([]domain.Riesgo, error)
	CreateRisk(risk domain.Riesgo) error
	DeleteRisk(id string) error
	UpdateRisk(updateData map[string]interface{}) (domain.Riesgo, error)
}

type riskRepository struct {
	RiskCollection *mongo.Collection
}

func NewRiskRepository(riskCollection *mongo.Collection) RiskRepository {
	return &riskRepository{
		RiskCollection: riskCollection,
	}
}

func (r *riskRepository) GetRisks() ([]domain.Riesgo, error) {
	cursor, err := r.RiskCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var risks []domain.Riesgo
	for cursor.Next(context.Background()) {
		var risk domain.Riesgo
		if err := cursor.Decode(&risk); err != nil {
			return nil, err
		}
		risks = append(risks, risk)
	}
	return risks, nil
}

func (r *riskRepository) CreateRisk(risk domain.Riesgo) error {
	risk.ID = bson.NewObjectID()
	risk.DateRegister = time.Now()
	_, err := r.RiskCollection.InsertOne(context.Background(), risk)
	return err
}

func (r *riskRepository) DeleteRisk(id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID de riesgo inválido")
	}
	_, err = r.RiskCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}

func (r *riskRepository) UpdateRisk(updateData map[string]interface{}) (domain.Riesgo, error) {
	idStr, ok := updateData["_id"].(string)
	if !ok {
		return domain.Riesgo{}, errors.New("ID de riesgo no proporcionado o inválido")
	}
	objID, err := bson.ObjectIDFromHex(idStr)
	if err != nil {
		return domain.Riesgo{}, errors.New("ID de riesgo inválido")
	}
	delete(updateData, "_id")

	update := bson.M{"$set": updateData}
	_, err = r.RiskCollection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		return domain.Riesgo{}, err
	}

	var updatedRisk domain.Riesgo
	err = r.RiskCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&updatedRisk)
	if err != nil {
		return domain.Riesgo{}, err
	}
	return updatedRisk, nil
}
