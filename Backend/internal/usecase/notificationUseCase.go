package usecase

import (
	"backend/Backend/internal/domain"
	"backend/Backend/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type NotificationUseCase interface {
	CreateNotification(c *gin.Context)
	DeleteNotification(c *gin.Context)
	UpdateNotification(c *gin.Context)
	GetNotifications(c *gin.Context)
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

	err := n.notificationRepository.CreateNotification(notification)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear aviso: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"Aviso": notification})
}

func (n notificationUseCase) DeleteNotification(c *gin.Context) {
	notificationID := c.Param("id")
	if notificationID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de aviso no proporcionado"})
		return
	}

	err := n.notificationRepository.DeleteNotification(notificationID)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al eliminar aviso: " + err.Error()})
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

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	updateData["_id"] = notificationID
	updatedNotification, err := n.notificationRepository.UpdateNotification(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al actualizar la aviso: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedNotification})
}

func (n notificationUseCase) GetNotifications(c *gin.Context) {
	notifications, err := n.notificationRepository.GetNotifications()
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener aviso: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": notifications})
}
