package usecase

import (
	"github.com/SebaVCH/hdcProject/internal/domain"
	"github.com/SebaVCH/hdcProject/internal/repository"
	"github.com/SebaVCH/hdcProject/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
)

type NotificationUseCase interface {
	CreateNotification(c *gin.Context)
	DeleteNotification(c *gin.Context)
	UpdateNotification(c *gin.Context)
	GetNotifications(c *gin.Context)
	GetUnreadNotifications(c *gin.Context)
	GetReadNotifications(c *gin.Context)
	MarkNotificationAsRead(c *gin.Context)
}

type notificationUseCase struct {
	notificationRepository repository.NotificationRepository
}

func NewNotificationUseCase(notificationRepository repository.NotificationRepository) NotificationUseCase {
	return &notificationUseCase{
		notificationRepository: notificationRepository,
	}
}

func (n notificationUseCase) CreateNotification(c *gin.Context) {
	var notification domain.Aviso
	if err := c.ShouldBindJSON(&notification); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	if !utils.IsValidString(notification.Description) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Descripción con caracteres inválidos"})
		return
	}

	err := n.notificationRepository.CreateNotification(notification)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear aviso"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": notification})
}

func (n notificationUseCase) DeleteNotification(c *gin.Context) {
	notificationID := c.Param("id")
	if notificationID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de aviso no proporcionado"})
		return
	}

	err := n.notificationRepository.DeleteNotification(notificationID)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al eliminar aviso"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Aviso eliminada correctamente"})
}

func (n notificationUseCase) UpdateNotification(c *gin.Context) {
	notificationID := c.Param("id")
	if notificationID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de aviso no proporcionado"})
		return
	}

	claims, _ := c.Get("user")
	userClaims := claims.(jwt.MapClaims)
	userID := userClaims["user_id"].(string)
	userRole := userClaims["user_role"].(string)

	if userRole != "admin" {
		if err := n.notificationRepository.FindByIDAndUserID(notificationID, userID); err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	if !utils.SanitizeStringFields(c, updateData) {
		return
	}

	updateData["_id"] = notificationID
	updatedNotification, err := n.notificationRepository.UpdateNotification(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al actualizar la aviso"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedNotification})
}

func (n notificationUseCase) GetNotifications(c *gin.Context) {

	notifications, err := n.notificationRepository.GetNotifications()
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener aviso"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": notifications})
}

func (n notificationUseCase) GetUnreadNotifications(c *gin.Context) {
	claims, _ := c.Get("user")
	userClaims := claims.(jwt.MapClaims)
	userID := userClaims["user_id"].(string)
	notifications, err := n.notificationRepository.GetUnreadNotifications(userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener aviso"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": notifications})
}

func (n notificationUseCase) GetReadNotifications(c *gin.Context) {
	claims, _ := c.Get("user")
	userClaims := claims.(jwt.MapClaims)
	userID := userClaims["user_id"].(string)
	notifications, err := n.notificationRepository.GetReadNotifications(userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener aviso"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": notifications})
}

func (n notificationUseCase) MarkNotificationAsRead(c *gin.Context) {
	notificationID := c.Param("id")
	claims, _ := c.Get("user")
	userClaims := claims.(jwt.MapClaims)
	userID := userClaims["user_id"].(string)
	err := n.notificationRepository.MarkNotificationAsRead(notificationID, userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener aviso"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Aviso marcado como leído correctamente"})
}
