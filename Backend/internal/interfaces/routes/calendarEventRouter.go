package routes

import (
	"backend/Backend/internal/infrastructure/database"
	"backend/Backend/internal/interfaces/controller"
	"backend/Backend/internal/interfaces/middleware"
	"backend/Backend/internal/repository"
	"backend/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupCalendarEventRouter(r *gin.Engine) {
	calendarEventRepo := repository.NewCalendarEventRepository(database.Client.Database("pip").Collection("calendarEvents"))
	calendarEventUseCase := usecase.NewCalendarEventUseCase(calendarEventRepo)
	calendarEventController := controller.NewCalendarEventController(calendarEventUseCase)

	protected := r.Group("/calendar-event")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("", calendarEventController.CreateCalendarEvent)
	protected.GET("", calendarEventController.GetAllCalendarEvents)
	protected.PUT("/:id", calendarEventController.UpdateCalendarEvent)
	protected.DELETE("/:id", calendarEventController.DeleteCalendarEvent)
}
