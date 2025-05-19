package services

import (
	"backend/Backend/models"
	"backend/Backend/utils"
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type AuthService interface {
	Login(email, password string) (string, error)
	Register(user models.Usuario) (string, error)
}

type AuthServiceImpl struct {
	UserCollection *mongo.Collection
}

func NewAuthServiceImpl(userCollection *mongo.Collection) AuthService {
	return &AuthServiceImpl{UserCollection: userCollection}
}

func (a *AuthServiceImpl) Login(email, password string) (string, error) {
	var user models.Usuario
	err := a.UserCollection.FindOne(context.TODO(), bson.M{"email": email}).Decode(&user)
	if err != nil {
		return "", errors.New("Error al iniciar sesion")
	}

	if !utils.CheckPasswordHash(password, user.Password) {
		return "", errors.New("Error al iniciar sesion")
	}

	token, err := utils.GenerateToken(user.ID.Hex())
	if err != nil {
		return "", err
	}

	return token, nil
}

func (a *AuthServiceImpl) Register(user models.Usuario) (string, error) {

	existing := a.UserCollection.FindOne(context.TODO(), bson.M{"email": user.Email})
	if existing.Err() == nil {
		return "", errors.New("El usuario ya existe")
	}

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return "", err
	}

	unhashedPassword := user.Password
	user.Password = hashedPassword
	user.CompletedRoutes = 0
	user.ListRoutes = []models.Route{}

	res, err := a.UserCollection.Database().Collection("usuarios").InsertOne(context.TODO(), user)
	if err != nil {
		return "", err
	}

	usuarioID := res.InsertedID.(bson.ObjectID)

	token, err := utils.GenerateToken(usuarioID.Hex())
	if err != nil {
		return "", err
	}

	go utils.SendRegistrationMail(user, unhashedPassword)


	return token, nil
}
