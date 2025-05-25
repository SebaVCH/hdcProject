package handlers

import (
	"backend/Backend/models"
	"backend/Backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type CalendarEventHandler struct {
	CalendarEventService services.CalendarEventService
}

func NewCalendarEventHandler(service services.CalendarEventService) *CalendarEventHandler {
	return &CalendarEventHandler{CalendarEventService: service}
}

func (h *CalendarEventHandler) GetAllCalendarEvents(c *gin.Context) {
	events, err := h.CalendarEventService.GetAllCalendarEvents()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener eventos: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, events)
}

func (h *CalendarEventHandler) CreateCalendarEvent(c *gin.Context) {
	var event models.EventoCalendario
	if err := c.ShouldBindJSON(&event); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	err := h.CalendarEventService.CreateCalendarEvent(event)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el evento: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusCreated, event)
}

func (h *CalendarEventHandler) DeleteCalendarEvent(c *gin.Context) {
	id := c.Param("id")
	err := h.CalendarEventService.DeleteCalendarEvent(id)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar el evento: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Evento eliminado correctamente"})
}

func (h *CalendarEventHandler) UpdateCalendarEvent(c *gin.Context) {
	eventID := c.Param("id")
	if eventID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de evento no proporcionado"})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	updateData["_id"] = eventID
	updateEvent, err := h.CalendarEventService.UpdateCalendarEvent(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el evento: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": updateEvent})
}
