package handlers

import (
	"backend/Backend/models"
	"backend/Backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type PuntoAyudaHandler struct {
	HelpPointService services.HelpPointService
}

func NewHelpingPointHandler(service services.HelpPointService) *PuntoAyudaHandler {
	return &PuntoAyudaHandler{
		HelpPointService: service,
	}
}

func (h *PuntoAyudaHandler) GetAllPoints(c *gin.Context) {
	helpPoints, err := h.HelpPointService.GetAllPoints()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener puntos de ayuda: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": helpPoints})
}

func (h *PuntoAyudaHandler) CreateHelpingPoint(c *gin.Context) {
	var helpPoint models.PuntoAyuda
	if err := c.ShouldBindJSON(&helpPoint); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}

	err := h.HelpPointService.CreateHelpingPoint(helpPoint)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear punto de ayuda: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusCreated, gin.H{"message": helpPoint})
}

func (h *PuntoAyudaHandler) UpdateHelpingPoint(c *gin.Context) {
	helpingPointID := c.Param("id")
	if helpingPointID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de punto no proporcionado"})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	updateData["_id"] = helpingPointID
	updatedHelpingPoint, err := h.HelpPointService.UpdateHelpingPoint(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el punto de ayuda: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedHelpingPoint})
}

func (h *PuntoAyudaHandler) DeleteHelpingPoint(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de punto de ayuda no proporcionado"})
		return
	}

	err := h.HelpPointService.DeleteHelpingPoint(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al eliminar punto de ayuda: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Punto de ayuda eliminado correctamente"})
}
