package usecase

import (
	"backend/Backend/internal/domain"
	"backend/Backend/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type RiskUseCase interface {
	GetAllRisks(c *gin.Context)
	CreateRisk(c *gin.Context)
	DeleteRisk(c *gin.Context)
	UpdateRisk(c *gin.Context)
}

type riskUseCase struct {
	riskRepository repository.RiskRepository
}

func NewRiskUseCase(riskRepository repository.RiskRepository) RiskUseCase {
	return &riskUseCase{
		riskRepository: riskRepository,
	}
}

func (r riskUseCase) GetAllRisks(c *gin.Context) {
	risks, err := r.riskRepository.GetRisks()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener riesgos: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": risks})
}

func (r riskUseCase) CreateRisk(c *gin.Context) {
	var risk domain.Riesgo
	if err := c.ShouldBindJSON(&risk); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	err := r.riskRepository.CreateRisk(risk)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear el riesgo: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": risk})
}

func (r riskUseCase) DeleteRisk(c *gin.Context) {
	id := c.Param("id")
	err := r.riskRepository.DeleteRisk(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al eliminar el riesgo: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Riesgo eliminado correctamente"})
}

func (r riskUseCase) UpdateRisk(c *gin.Context) {
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
	updatedRisk, err := r.riskRepository.UpdateRisk(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al actualizar el riesgo: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedRisk})

}
