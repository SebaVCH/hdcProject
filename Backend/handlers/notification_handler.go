package handlers

import (
	"backend/Backend/models"
	"backend/Backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type NotificationHandler struct {
	NotificationService services.NotificationService
}

func NewNotificationHandler(service services.NotificationService) *NotificationHandler {
	return &NotificationHandler{
		NotificationService: service,
	}
}

func (a *NotificationHandler) CreateNotification(c *gin.Context) {
	var notification models.Aviso
	if err := c.ShouldBindJSON(&notification); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	err := a.NotificationService.CreateNotification(notification)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al crear aviso: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusCreated, gin.H{"Aviso": notification})
}

func (a *NotificationHandler) DeleteNotification(c *gin.Context) {
	notificationID := c.Param("id")
	if notificationID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de aviso no proporcionado"})
		return
	}

	err := a.NotificationService.DeleteNotification(notificationID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar aviso: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Aviso eliminada correctamente"})
}

func (a *NotificationHandler) UpdateNotification(c *gin.Context) {
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
	updatedNotification, err := a.NotificationService.UpdateNotification(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar la aviso: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedNotification})
}

func (a *NotificationHandler) GetNotifications(c *gin.Context) {
	notifications, err := a.NotificationService.GetNotifications()
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener aviso: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": notifications})
}
