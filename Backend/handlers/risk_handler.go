package handlers

import (
	"backend/Backend/models"
	"backend/Backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type RiskHandler struct {
	RiskService services.RiskService
}

func NewRiskHandler(service services.RiskService) *RiskHandler {
	return &RiskHandler{RiskService: service}
}

func (h *RiskHandler) GetAllRisks(c *gin.Context) {
	risks, err := h.RiskService.GetRisks()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener riesgos: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": risks})
}

func (h *RiskHandler) CreateRisk(c *gin.Context) {
	var risk models.Riesgo
	if err := c.ShouldBindJSON(&risk); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	err := h.RiskService.CreateRisk(risk)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el riesgo: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusCreated, gin.H{"message": risk})
}

func (h *RiskHandler) DeleteRisk(c *gin.Context) {
	id := c.Param("id")
	err := h.RiskService.DeleteRisk(id)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar el riesgo: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Riesgo eliminado correctamente"})
}

func (h *RiskHandler) UpdateRisk(c *gin.Context) {
	riskID := c.Param("id")
	if riskID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de riesgo no proporcionado"})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	updateData["_id"] = riskID
	updatedRisk, err := h.RiskService.UpdateRisk(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el riesgo: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedRisk})

}
