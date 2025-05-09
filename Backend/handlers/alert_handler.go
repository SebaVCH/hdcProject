package handlers

import (
	"backend/Backend/models"
	"backend/Backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AlertHandler struct {
	AlertService services.AlertService
}

func NewAlertHandler(alertService services.AlertService) *AlertHandler {
	return &AlertHandler{
		AlertService: alertService,
	}
}

func (a *AlertHandler) CreateAlert(c *gin.Context) {
	var alert models.Alerta
	if err := c.ShouldBindJSON(&alert); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	err := a.AlertService.CreateAlert(alert)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al crear alerta: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusCreated, gin.H{"alert": alert})
}

func (a *AlertHandler) DeleteAlert(c *gin.Context) {
	alertID := c.Param("id")
	if alertID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de alerta no proporcionado"})
		return
	}

	err := a.AlertService.DeleteAlert(alertID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar alerta: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Alerta eliminada correctamente"})
}

func (a *AlertHandler) UpdateAlert(c *gin.Context) {
	alertID := c.Param("id")
	if alertID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de alerta no proporcionado"})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	updateData["_id"] = alertID
	updatedAlert, err := a.AlertService.UpdateAlert(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar la alerta: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"alert": updatedAlert})
}

func (a *AlertHandler) GetAlerts(c *gin.Context) {
	alerts, err := a.AlertService.GetAlerts()
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener alertas: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"alerts": alerts})
}
