package repository

import (
	"backend/Backend/internal/domain"
	"backend/Backend/internal/utils"
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type UserRepository interface {
	GetUserByID(id string) (domain.Usuario, error)
	GetUserProfile(userID string) (domain.Usuario, error)
	UpdateUserInfo(userID bson.ObjectID, userData map[string]interface{}) (domain.Usuario, error)
	GetAllUsers() ([]domain.Usuario, error)
}

type userRepository struct {
	UserCollection *mongo.Collection
}

func NewUserRepository(userCollection *mongo.Collection) UserRepository {
	return &userRepository{UserCollection: userCollection}
}

func (u *userRepository) GetAllUsers() ([]domain.Usuario, error) {
	cursor, err := u.UserCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var users []domain.Usuario
	if err := cursor.All(context.Background(), &users); err != nil {
		return nil, err
	}
	return users, nil
}
func (u *userRepository) GetUserByID(id string) (domain.Usuario, error) {
	var user domain.Usuario
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return domain.Usuario{}, err
	}

	err = u.UserCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		return domain.Usuario{}, err
	}
	return user, nil
}

func (u *userRepository) GetUserProfile(userID string) (domain.Usuario, error) {
	return u.GetUserByID(userID)
}

func (u *userRepository) UpdateUserInfo(userID bson.ObjectID, userData map[string]interface{}) (domain.Usuario, error) {
	var currentUser domain.Usuario
	err := u.UserCollection.FindOne(context.Background(), bson.M{"_id": userID}).Decode(&currentUser)
	if err != nil {
		return domain.Usuario{}, errors.New("usuario no encontrado")
	}

	filteredData := make(map[string]interface{})

	if name, ok := userData["name"].(string); ok && name != "" {
		filteredData["name"] = name
	}

	if phone, ok := userData["phone"].(string); ok && phone != "" {
		filteredData["phone"] = phone
	}

	newPassword, newPassOk := userData["newPassword"].(string)
	if newPassOk && newPassword != "" {
		currentPassword, currentPassOk := userData["currentPassword"].(string)
		if !currentPassOk || currentPassword == "" {
			return domain.Usuario{}, errors.New("se requiere la contraseña actual para establecer una nueva")
		}

		if !utils.CheckPasswordHash(currentPassword, currentUser.Password) {
			return domain.Usuario{}, errors.New("la contraseña actual es incorrecta")
		}

		confirmNewPassword, confirmPassOk := userData["confirmNewPassword"].(string)
		if !confirmPassOk || confirmNewPassword == "" {
			return domain.Usuario{}, errors.New("se requiere la confirmación de la nueva contraseña")
		}

		if newPassword != confirmNewPassword {
			return domain.Usuario{}, errors.New("la nueva contraseña y su confirmación no coinciden")
		}

		hashedPassword, err := utils.HashPassword(newPassword)
		if err != nil {
			return domain.Usuario{}, errors.New("error al hashear la nueva contraseña")
		}
		filteredData["password"] = hashedPassword
	}

	if len(filteredData) == 0 {
		return domain.Usuario{}, errors.New("no se proporcionaron campos válidos para actualizar")
	}

	filter := bson.M{"_id": userID}
	update := bson.M{"$set": filteredData}

	_, err = u.UserCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return domain.Usuario{}, err
	}

	var updatedUser domain.Usuario
	err = u.UserCollection.FindOne(context.Background(), filter).Decode(&updatedUser)
	if err != nil {
		return domain.Usuario{}, err
	}

	return updatedUser, nil
}
