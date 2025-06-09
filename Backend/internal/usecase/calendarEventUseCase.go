package usecase

import (
	"backend/Backend/internal/domain"
	"backend/Backend/internal/repository"
	"backend/Backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
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
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener eventos"})
		return
	}
	c.IndentedJSON(http.StatusOK, events)
}

func (ce calendarEventUseCase) CreateCalendarEvent(c *gin.Context) {
	var event domain.EventoCalendario
	if err := c.ShouldBindJSON(&event); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	if !utils.IsValidString(event.Title) || !utils.IsValidString(event.Description) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "El título o la descripción contienen caracteres inválidos"})
		return
	}

	err := ce.calendarRepository.CreateCalendarEvent(event)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear el evento: "})
		return
	}
	c.IndentedJSON(http.StatusOK, event)
}

func (ce calendarEventUseCase) DeleteCalendarEvent(c *gin.Context) {
	eventID := c.Param("eventID")

	if eventID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de evento no proporcionado"})
		return
	}

	claims, _ := c.Get("user")
	userClaims := claims.(jwt.MapClaims)
	userID := userClaims["user_id"].(string)
	userRole := userClaims["user_role"].(string)

	if userRole != "admin" {
		if err := ce.calendarRepository.FindByIDAndUserID(eventID, userID); err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
	}

	err := ce.calendarRepository.DeleteCalendarEvent(eventID)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al eliminar el evento"})
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

	claims, _ := c.Get("user")
	userClaims := claims.(jwt.MapClaims)
	userID := userClaims["user_id"].(string)
	userRole := userClaims["user_role"].(string)

	if userRole != "admin" {
		if err := ce.calendarRepository.FindByIDAndUserID(eventID, userID); err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}
	updateData["_id"] = eventID

	if !utils.SanitizeStringFields(c, updateData) {
		return
	}

	updateEvent, err := ce.calendarRepository.UpdateCalendarEvent(updateData)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al actualizar el evento"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": updateEvent})
}
