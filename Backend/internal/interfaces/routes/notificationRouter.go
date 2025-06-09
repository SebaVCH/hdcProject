package routes

import (
	"backend/Backend/internal/infrastructure/database"
	"backend/Backend/internal/interfaces/controller"
	"backend/Backend/internal/interfaces/middleware"
	"backend/Backend/internal/repository"
	"backend/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupNotificationRouter(r *gin.Engine) {

	notificationRepo := repository.NewNotificationRepository(database.Client.Database("pip").Collection("alertas"), database.Client.Database("pip").Collection("usuarios"))
	notificationUseCase := usecase.NewNotificationUseCase(notificationRepo)
	notificationController := controller.NewNotificationController(notificationUseCase)

	protected := r.Group("/notification")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("", notificationController.CreateNotification)
	protected.GET("", notificationController.GetNotifications)
	protected.PUT("/:id", notificationController.UpdateNotification)
	protected.DELETE("/:id", middleware.RoleMiddleware("admin"), notificationController.DeleteNotification) // admin
}
