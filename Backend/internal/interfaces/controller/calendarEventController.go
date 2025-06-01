package controller

import (
	"backend/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type calendarEventController struct {
	calendarEventUseCase usecase.CalendarEventUseCase
}

func NewCalendarEventController(calendarEventUseCase usecase.CalendarEventUseCase) *calendarEventController {
	return &calendarEventController{
		calendarEventUseCase: calendarEventUseCase,
	}
}

func (ce *calendarEventController) CreateCalendarEvent(c *gin.Context) {
	ce.calendarEventUseCase.CreateCalendarEvent(c)
}

func (ce *calendarEventController) GetAllCalendarEvents(c *gin.Context) {
	ce.calendarEventUseCase.GetAllCalendarEvents(c)
}

func (ce *calendarEventController) DeleteCalendarEvent(c *gin.Context) {
	ce.calendarEventUseCase.DeleteCalendarEvent(c)
}

func (ce *calendarEventController) UpdateCalendarEvent(c *gin.Context) {
	ce.calendarEventUseCase.UpdateCalendarEvent(c)
}
