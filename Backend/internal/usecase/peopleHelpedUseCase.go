package usecase

import (
	"backend/Backend/internal/domain"
	"backend/Backend/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type PeopleHelpedUseCase interface {
	GetAllPeopleHelped(c *gin.Context)
	CreatePersonHelped(c *gin.Context)
	DeletePersonHelped(c *gin.Context)
	UpdatePersonHelped(c *gin.Context)
}

type peopleHelpedUseCase struct {
	peopleHelpedRepository repository.PeopleHelpedRepository
}

func NewPeopleHelpedUseCase(peopleHelpedRepository repository.PeopleHelpedRepository) PeopleHelpedUseCase {
	return &peopleHelpedUseCase{
		peopleHelpedRepository: peopleHelpedRepository,
	}
}

func (p peopleHelpedUseCase) GetAllPeopleHelped(c *gin.Context) {
	peopleHelped, err := p.peopleHelpedRepository.GetPeopleHelped()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener personas ayudadas: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": peopleHelped})
}

func (p peopleHelpedUseCase) CreatePersonHelped(c *gin.Context) {
	var person domain.PersonaAyudada
	if err := c.ShouldBindJSON(&person); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	err := p.peopleHelpedRepository.CreatePersonHelped(person)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear la persona ayudada: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": person})
}

func (p peopleHelpedUseCase) DeletePersonHelped(c *gin.Context) {
	id := c.Param("id")
	err := p.peopleHelpedRepository.DeletePersonHelped(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al eliminar la persona ayudada: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Persona ayudada eliminada correctamente"})
}

func (p peopleHelpedUseCase) UpdatePersonHelped(c *gin.Context) {
	personID := c.Param("id")
	if personID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de persona ayudada no proporcionado"})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	updateData["_id"] = personID
	updatedPerson, err := p.peopleHelpedRepository.UpdatePersonHelped(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al actualizar la persona ayudada: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedPerson})
}
