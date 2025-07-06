package usecase

import (
	"github.com/SebaVCH/hdcProject/internal/domain"
	"github.com/SebaVCH/hdcProject/internal/repository"
	"github.com/SebaVCH/hdcProject/internal/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

type InstitutionUseCase interface {
	GetAllInstitutions(c *gin.Context)
	GetInstitutionByID(c *gin.Context)
	CreateInstitution(c *gin.Context)
	UpdateInstitution(c *gin.Context)
	DeleteInstitution(c *gin.Context)
}

type institutionUseCase struct {
	institutionRepository repository.InstitutionRepository
}

func NewInstitutionUseCase(institutionRepository repository.InstitutionRepository) InstitutionUseCase {
	return &institutionUseCase{
		institutionRepository: institutionRepository,
	}
}

func (i institutionUseCase) GetAllInstitutions(c *gin.Context) {
	institutions, err := i.institutionRepository.GetAllInstitutions()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener las instituciones"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": institutions})
}

func (i institutionUseCase) GetInstitutionByID(c *gin.Context) {
	idSTR := c.Param("id")

	if idSTR == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de institución no proporcionado"})
		return
	}

	institution, err := i.institutionRepository.GetInstitutionByID(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener la institución"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": institution})
}

func (i institutionUseCase) CreateInstitution(c *gin.Context) {
	var institution domain.Institution
	if err := c.ShouldBindJSON(&institution); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	if !utils.IsValidString(institution.Name) || !utils.IsValidColor(institution.Color) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "El nombre o el color presentan caracteres no permitidos"})
		return
	}

	err := i.institutionRepository.CreateInstitution(institution)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear la institución"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Institución creada con éxito."})
}

func (i institutionUseCase) UpdateInstitution(c *gin.Context) {
	idSTR := c.Param("id")
	if idSTR == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de institución no proporcionado"})
		return
	}

	_, err := i.institutionRepository.GetInstitutionByID(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Institución no encontrada"})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	name, nameOk := updateData["name"].(string)
	color, colorOk := updateData["color"].(string)

	if nameOk && !utils.IsValidString(name) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "El nombre presenta caracteres no permitidos"})
		return
	}
	if colorOk && !utils.IsValidColor(color) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "El color presenta caracteres no permitidos"})
		return
	}

	err = i.institutionRepository.UpdateInstitution(idSTR, updateData)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al actualizar la institución"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Institución actualizada correctamente"})
}

func (i institutionUseCase) DeleteInstitution(c *gin.Context) {
	idSTR := c.Param("id")

	if idSTR == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de institución no proporcionado"})
		return
	}

	_, err := i.institutionRepository.GetInstitutionByID(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Institución no encontrada"})
		return
	}

	err = i.institutionRepository.DeleteInstitution(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al eliminar la institución"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Institución eliminada correctamente"})
}
