package repository

import (
	"context"
	"errors"
  "time"
  "fmt"
	"github.com/SebaVCH/hdcProject/internal/domain"
	"github.com/SebaVCH/hdcProject/internal/utils"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type AuthRepository interface {
	Login(email, password string) (string, error)
	Register(user domain.Usuario) (string, error)
}

type authRepository struct {
	UserCollection *mongo.Collection
}

func NewAuthRepository(userCollection *mongo.Collection) AuthRepository {
	return &authRepository{UserCollection: userCollection}
}

func (a *authRepository) Login(email, password string) (string, error) {
	var user domain.Usuario
	err := a.UserCollection.FindOne(context.TODO(), bson.M{"email": email}).Decode(&user)
	if err != nil {
		return "", errors.New("error al iniciar sesión")
	}

	if !utils.CheckPasswordHash(password, user.Password) {
		return "", errors.New("error al iniciar sesión")
	}

	token, err := utils.GenerateToken(user.ID.Hex(), user.Role)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (a *authRepository) Register(user domain.Usuario) (string, error) {

	existing := a.UserCollection.FindOne(context.TODO(), bson.M{"email": user.Email})
	if existing.Err() == nil {
		return "", errors.New("el usuario ya existe")
	}

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return "", err
	}

	unhashedPassword := user.Password
	user.Password = hashedPassword
	user.CompletedRoutes = 0
	user.ListRoutes = []domain.Route{}
	user.DateRegister = time.Now()

	res, err := a.UserCollection.Database().Collection("usuarios").InsertOne(context.TODO(), user)
	if err != nil {
		return "", err
	}

	usuarioID := res.InsertedID.(bson.ObjectID)

	token, err := utils.GenerateToken(usuarioID.Hex(), user.Role)
	if err != nil {
		return "", err
	}

	err = utils.SendRegistrationMail(user, unhashedPassword)
	if err != nil {
		fmt.Println("Error enviando correo:", err)
	}

	return token, nil
}
