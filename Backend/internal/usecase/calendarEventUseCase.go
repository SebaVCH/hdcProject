package usecase

import (
	"backend/Backend/internal/domain"
	"backend/Backend/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type CalendarEventUseCase interface {
	GetAllCalendarEvents(c *gin.Context)
	CreateCalendarEvent(c *gin.Context)
	DeleteCalendarEvent(c *gin.Context)
	UpdateCalendarEvent(c *gin.Context)
}

type calendarEventUseCase struct {
	calendarRepository repository.CalendarEventRepository
}

func NewCalendarEventUseCase(calendarRepository repository.CalendarEventRepository) CalendarEventUseCase {
	return &calendarEventUseCase{
		calendarRepository: calendarRepository,
	}
}

func (ce calendarEventUseCase) GetAllCalendarEvents(c *gin.Context) {
	events, err := ce.calendarRepository.GetAllCalendarEvents()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener eventos: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, events)
}

func (ce calendarEventUseCase) CreateCalendarEvent(c *gin.Context) {
	var event domain.EventoCalendario
	if err := c.ShouldBindJSON(&event); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}
	err := ce.calendarRepository.CreateCalendarEvent(event)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear el evento: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, event)
}

func (ce calendarEventUseCase) DeleteCalendarEvent(c *gin.Context) {
	id := c.Param("id")
	err := ce.calendarRepository.DeleteCalendarEvent(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al eliminar el evento: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Evento eliminado correctamente"})
}

func (ce calendarEventUseCase) UpdateCalendarEvent(c *gin.Context) {
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
	updateEvent, err := ce.calendarRepository.UpdateCalendarEvent(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al actualizar el evento: " + err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": updateEvent})
}
