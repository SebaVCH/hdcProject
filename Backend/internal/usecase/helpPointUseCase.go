package usecase

import (
	"backend/Backend/internal/domain"
	"backend/Backend/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type HelpingPointUseCase interface {
	GetAllPoints(c *gin.Context)
	CreateHelpingPoint(c *gin.Context)
	UpdateHelpingPoint(c *gin.Context)
	DeleteHelpingPoint(c *gin.Context)
}

type helpingPointUseCase struct {
	helpingPointRepository repository.HelpPointRepository
}

func NewHelpingPointUseCase(helpingPointRepository repository.HelpPointRepository) HelpingPointUseCase {
	return &helpingPointUseCase{
		helpingPointRepository: helpingPointRepository,
	}
}

func (h helpingPointUseCase) GetAllPoints(c *gin.Context) {
	helpPoints, err := h.helpingPointRepository.GetAllPoints()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener puntos de ayuda: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": helpPoints})
}

func (h helpingPointUseCase) CreateHelpingPoint(c *gin.Context) {
	var helpPoint domain.PuntoAyuda
	if err := c.ShouldBindJSON(&helpPoint); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}

	err := h.helpingPointRepository.CreateHelpingPoint(helpPoint)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear punto de ayuda: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": helpPoint})
}

func (h helpingPointUseCase) UpdateHelpingPoint(c *gin.Context) {
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
	updatedHelpingPoint, err := h.helpingPointRepository.UpdateHelpingPoint(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al actualizar el punto de ayuda: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedHelpingPoint})
}

func (h helpingPointUseCase) DeleteHelpingPoint(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de punto de ayuda no proporcionado"})
		return
	}

	err := h.helpingPointRepository.DeleteHelpingPoint(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al eliminar punto de ayuda: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Punto de ayuda eliminado correctamente"})
}
