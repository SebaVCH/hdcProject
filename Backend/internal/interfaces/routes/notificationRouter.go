package routes

import (
	"github.com/SebaVCH/hdcProject/internal/infrastructure/database"
	"github.com/SebaVCH/hdcProject/internal/interfaces/controller"
	"github.com/SebaVCH/hdcProject/internal/interfaces/middleware"
	"github.com/SebaVCH/hdcProject/internal/repository"
	"github.com/SebaVCH/hdcProject/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupNotificationRouter(r *gin.Engine) {

	notificationRepo := repository.NewNotificationRepository(database.Client.Database("pip").Collection("alertas"), database.Client.Database("pip").Collection("usuarios"), database.Client.Database("pip").Collection("notification_person_relation"))
	notificationUseCase := usecase.NewNotificationUseCase(notificationRepo)
	notificationController := controller.NewNotificationController(notificationUseCase)

	protected := r.Group("/notification")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("", notificationController.CreateNotification)
	protected.GET("", notificationController.GetNotifications)
	protected.PUT("/:id", notificationController.UpdateNotification)
	protected.DELETE("/:id", middleware.RoleMiddleware("admin"), notificationController.DeleteNotification)
	protected.GET("/unread", notificationController.GetUnreadNotifications)
	protected.GET("/read", notificationController.GetReadNotifications)
	protected.PUT("/read/:id", notificationController.MarkNotificationAsRead)
}
