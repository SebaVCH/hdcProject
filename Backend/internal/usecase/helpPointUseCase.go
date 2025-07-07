package usecase

import (
	"net/http"

	"github.com/SebaVCH/hdcProject/internal/domain"
	"github.com/SebaVCH/hdcProject/internal/repository"
	"github.com/SebaVCH/hdcProject/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
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
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener puntos de ayuda"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": helpPoints})
}

func (h helpingPointUseCase) CreateHelpingPoint(c *gin.Context) {
	var helpPoint domain.PuntoAyuda

	claims, _ := c.Get("user")
	userClaims := claims.(jwt.MapClaims)
	userID := userClaims["user_id"].(string)

	if err := c.ShouldBindJSON(&helpPoint); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	if !utils.IsValidString(helpPoint.PeopleHelped.Gender) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Género inválido"})
		return
	}

	err := h.helpingPointRepository.CreateHelpingPoint(helpPoint, userID)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear punto de ayuda"})
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

	claims, _ := c.Get("user")
	userClaims := claims.(jwt.MapClaims)
	userID := userClaims["user_id"].(string)

	if err := h.helpingPointRepository.FindByIDAndUserID(helpingPointID, userID); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	if !utils.SanitizeStringFields(c, updateData) {
		return
	}

	updateData["_id"] = helpingPointID
	updatedHelpingPoint, err := h.helpingPointRepository.UpdateHelpingPoint(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al actualizar el punto de ayuda"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedHelpingPoint})
}

func (h helpingPointUseCase) DeleteHelpingPoint(c *gin.Context) {
	helpingPointID := c.Param("id")
	if helpingPointID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de punto de ayuda no proporcionado"})
		return
	}

	claims, _ := c.Get("user")
	userClaims := claims.(jwt.MapClaims)
	userID := userClaims["user_id"].(string)

	if err := h.helpingPointRepository.FindByIDAndUserID(helpingPointID, userID); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	err := h.helpingPointRepository.DeleteHelpingPoint(helpingPointID)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al eliminar punto de ayuda"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Punto de ayuda eliminado correctamente"})
}
