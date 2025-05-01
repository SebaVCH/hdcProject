package handlers

import (
	"backend/Backend/models"
	"backend/Backend/services"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
)

type UserHandler struct {
	UserService services.UserService
}

func NewUserHandler(service services.UserService) *UserHandler {
	return &UserHandler{
		UserService: service,
	}
}

func (h *UserHandler) GetUserByID(c *gin.Context) {
	id := c.Param("id")
	user, err := h.UserService.GetUserByID(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"user": user})
}

func (h *UserHandler) GetUserProfile(c *gin.Context) {
	user, done := h.ValidateUser(c)
	if done {
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"user": user})

}

func (h *UserHandler) UpdateUserInfo(c *gin.Context) {
	user, done := h.ValidateUser(c)
	if done {
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}

	updatedUser, err := h.UserService.UpdateUserInfo(user.ID, updateData)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar usuario: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"user": updatedUser})
}

func (h *UserHandler) ValidateUser(c *gin.Context) (models.Usuario, bool) {
	claims, exists := c.Get("user")
	if !exists {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autenticado"})
		return models.Usuario{}, true
	}

	mapClaims, ok := claims.(jwt.MapClaims)
	if !ok {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error en formato de token"})
		return models.Usuario{}, true
	}

	userID, exists := mapClaims["user_id"]
	if !exists {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "ID de usuario no encontrado en token"})
		return models.Usuario{}, true
	}

	userIDStr, ok := userID.(string)
	if !ok {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "ID de usuario en formato inválido"})
		return models.Usuario{}, true
	}

	user, err := h.UserService.GetUserByID(userIDStr)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return models.Usuario{}, true
	}
	return user, false
}
