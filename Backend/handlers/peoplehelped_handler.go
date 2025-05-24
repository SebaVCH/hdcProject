package handlers

import (
	"backend/Backend/models"
	"backend/Backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type PeopleHelpedHandler struct {
	PeopleHelpedService services.PeopleHelpedService
}

func NewPeopleHelpedHandler(service services.PeopleHelpedService) *PeopleHelpedHandler {
	return &PeopleHelpedHandler{PeopleHelpedService: service}
}

func (h *PeopleHelpedHandler) GetAllPeopleHelped(c *gin.Context) {
	peopleHelped, err := h.PeopleHelpedService.GetPeopleHelped()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener personas ayudadas: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": peopleHelped})
}

func (h *PeopleHelpedHandler) CreatePersonHelped(c *gin.Context) {
	var person models.PersonaAyudada
	if err := c.ShouldBindJSON(&person); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	err := h.PeopleHelpedService.CreatePersonHelped(person)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al crear la persona ayudada: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusCreated, gin.H{"message": person})
}

func (h *PeopleHelpedHandler) DeletePersonHelped(c *gin.Context) {
	id := c.Param("id")
	err := h.PeopleHelpedService.DeletePersonHelped(id)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar la persona ayudada: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Persona ayudada eliminada correctamente"})
}

func (h *PeopleHelpedHandler) UpdatePersonHelped(c *gin.Context) {
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
	updatedPerson, err := h.PeopleHelpedService.UpdatePersonHelped(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar la persona ayudada: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": updatedPerson})
}
