package services

import (
	"backend/Backend/models"
	"backend/Backend/utils"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type UserService interface {
	GetUserByID(id string) (models.Usuario, error)
	GetUserProfile(userID string) (models.Usuario, error)
	UpdateUserInfo(userID bson.ObjectID, userData map[string]interface{}) (models.Usuario, error)
}

type UserServiceImpl struct {
	UserCollection *mongo.Collection
}

func NewUserServiceImpl(userCollection *mongo.Collection) UserService {
	return &UserServiceImpl{UserCollection: userCollection}
}

func (s *UserServiceImpl) GetUserByID(id string) (models.Usuario, error) {
	var user models.Usuario
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return models.Usuario{}, err
	}

	err = s.UserCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		return models.Usuario{}, err
	}
	return user, nil
}

func (s *UserServiceImpl) GetUserProfile(userID string) (models.Usuario, error) {
	return s.GetUserByID(userID)
}

func (s *UserServiceImpl) UpdateUserInfo(userID bson.ObjectID, userData map[string]interface{}) (models.Usuario, error) {
	filteredData := make(map[string]interface{})

	if name, ok := userData["name"]; ok {
		filteredData["name"] = name
	}

	if password, ok := userData["password"]; ok {
		hashedPassword, err := utils.HashPassword(password.(string))
		if err != nil {
			return models.Usuario{}, err
		}
		filteredData["password"] = hashedPassword
	}

	if phone, ok := userData["phone"]; ok {
		filteredData["phone"] = phone
	}

	if len(filteredData) == 0 {
		return models.Usuario{}, errors.New("No se proporcionaron campos válidos para actualizar")
	}

	filter := bson.M{"_id": userID}
	update := bson.M{"$set": filteredData}

	_, err := s.UserCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return models.Usuario{}, err
	}

	var updatedUser models.Usuario
	err = s.UserCollection.FindOne(context.Background(), filter).Decode(&updatedUser)
	if err != nil {
		return models.Usuario{}, err
	}

	return updatedUser, nil
}
