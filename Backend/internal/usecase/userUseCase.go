package usecase

import (
	"backend/Backend/internal/domain"
	"backend/Backend/internal/repository"
	"backend/Backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
)

type UserUseCase interface {
	GetUserByID(c *gin.Context)
	GetUserProfile(c *gin.Context)
	UpdateUserInfo(c *gin.Context)
	GetAllUsers(c *gin.Context)
}

type userUseCase struct {
	userRepository repository.UserRepository
}

func NewUserUseCase(repo repository.UserRepository) UserUseCase {
	return &userUseCase{
		userRepository: repo,
	}
}

func (u userUseCase) GetUserByID(c *gin.Context) {
	id := c.Param("id")
	user, err := u.userRepository.GetUserByID(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Usuario no encontrado"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": user})
}

func (u userUseCase) GetUserProfile(c *gin.Context) {
	user, done := u.ValidateUser(c)
	if done {
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": user})
}

func (u userUseCase) UpdateUserInfo(c *gin.Context) {
	user, done := u.ValidateUser(c)
	if done {
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	for key, value := range updateData {
		strVal, ok := value.(string)
		if ok {
			switch key {
			case "phone":
				if !utils.IsValidPhone(strVal) {
					c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Teléfono inválido"})
					return
				}
			default:
				if !utils.IsValidString(strVal) {
					c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Hay caracteres inválidos"})
					return
				}
			}
			updateData[key] = strVal
		}
	}

	updatedUser, err := u.userRepository.UpdateUserInfo(user.ID, updateData)

	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al actualizar usuario"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedUser})
}

func (u userUseCase) GetAllUsers(c *gin.Context) {
	users, err := u.userRepository.GetAllUsers()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener usuarios"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": users})
}

func (u userUseCase) ValidateUser(c *gin.Context) (domain.Usuario, bool) {
	claims, exists := c.Get("user")
	if !exists {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autenticado"})
		return domain.Usuario{}, true
	}

	mapClaims, ok := claims.(jwt.MapClaims)
	if !ok {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error en formato de token"})
		return domain.Usuario{}, true
	}

	userID, exists := mapClaims["user_id"]
	if !exists {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "ID de usuario no encontrado en token"})
		return domain.Usuario{}, true
	}

	userIDStr, ok := userID.(string)
	if !ok {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de usuario en formato inválido"})
		return domain.Usuario{}, true
	}

	user, err := u.userRepository.GetUserByID(userIDStr)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Usuario no encontrado"})
		return domain.Usuario{}, true
	}
	return user, false
}
